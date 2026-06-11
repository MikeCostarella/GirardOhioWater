import { useEffect, useState } from "react";
import type { WaterLocation } from "./types/account";
import { loadLocations, countAccounts } from "./data/loadLocations";
import WaterMap from "./components/WaterMap";

/**
 * Phase 3 in progress. Base map is live; markers, tooltips, dialog, search,
 * and legend land in subsequent slices (one commit each).
 */
export default function App() {
  const [locations, setLocations] = useState<WaterLocation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations()
      .then(setLocations)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
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

      <WaterMap />
    </>
  );
}
