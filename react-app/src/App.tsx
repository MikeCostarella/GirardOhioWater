import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { WaterLocation } from "./types/account";
import { loadLocations, countAccounts } from "./data/loadLocations";
import { findLocation } from "./data/search";
import WaterMap, { MAP_CENTER, MAP_ZOOM } from "./components/WaterMap";
import AccountDialog from "./components/AccountDialog";
import Legend from "./components/Legend";
import BuildStamp from "./components/BuildStamp";

/**
 * Phase 3 in progress. Base map + markers + click dialog + search are live;
 * the legend lands in the next slice.
 */
export default function App() {
  const [locations, setLocations] = useState<WaterLocation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WaterLocation | null>(null);
  const [query, setQuery] = useState("");
  const [noResult, setNoResult] = useState(false);
  const [boundaryVisible, setBoundaryVisible] = useState({
    municipalities: false,
    townships: false,
  });
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    loadLocations()
      .then(setLocations)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const onMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  const doSearch = useCallback(() => {
    setNoResult(false);
    const found = findLocation(locations ?? [], query);
    if (found && mapRef.current) {
      mapRef.current.flyTo([found.lat, found.lon], 17, { animate: true, duration: 1 });
      window.setTimeout(() => setSelected(found), 800);
    } else if (query.trim()) {
      setNoResult(true);
    }
  }, [locations, query]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setNoResult(false);
    mapRef.current?.flyTo(MAP_CENTER, MAP_ZOOM, { animate: true });
  }, []);

  const toggleBoundary = useCallback((id: "municipalities" | "townships") => {
    setBoundaryVisible((v) => ({ ...v, [id]: !v[id] }));
  }, []);

  const locCount = locations?.length ?? 0;
  const acctCount = locations ? countAccounts(locations) : 0;

  return (
    <>
      <div id="header">
        <div className="title-block">
          <h1>&#128204; Girard Ohio Water Accounts Map</h1>
          <p>Interactive mapping of municipal water service accounts</p>
        </div>
        <div className="meta">
          <span>Created by:</span> Mike Costarella
        </div>
      </div>

      <div id="stats-bar">
        <div className="stat">
          {error ? (
            <span style={{ color: "#F44336" }}>Error: {error}</span>
          ) : (
            <>
              Total Locations: <b>{locCount.toLocaleString()}</b> &nbsp;|&nbsp; Total
              Accounts: <b>{acctCount.toLocaleString()}</b>
            </>
          )}
        </div>
      </div>

      <div id="search-bar">
        <input
          type="text"
          value={query}
          placeholder="Search by account # or address..."
          onChange={(e) => {
            setQuery(e.target.value);
            setNoResult(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") doSearch();
          }}
        />
        <button onClick={doSearch}>&#128269; Search</button>
        <button className="clear" onClick={clearSearch}>
          Clear
        </button>
        {noResult && <span className="search-msg">No accounts found matching: {query}</span>}
      </div>

      <div id="map-wrap">
        <WaterMap
          locations={locations ?? []}
          onSelect={setSelected}
          onMapReady={onMapReady}
          boundaryVisible={boundaryVisible}
        />
        <Legend boundaryVisible={boundaryVisible} onToggleBoundary={toggleBoundary} />
      </div>

      <AccountDialog location={selected} onClose={() => setSelected(null)} />

      <BuildStamp />
    </>
  );
}
