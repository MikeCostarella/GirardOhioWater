import { memo } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { WaterLocation } from "../types/account";
import { HOME_JURISDICTION } from "../types/account";
import { colorForCount, radiusForCount } from "../data/markerStyle";
import { tooltipHtml } from "../data/tooltip";

interface AccountMarkersProps {
  locations?: WaterLocation[];
  onSelect?: (loc: WaterLocation) => void;
  /** When true, only render locations outside the home jurisdiction. */
  outOfCityOnly?: boolean;
}

function isOutside(loc: WaterLocation): boolean {
  return !!loc.jurisdiction && loc.jurisdiction !== HOME_JURISDICTION;
}

/**
 * One CircleMarker per location, colored + sized by account count, grouped into
 * a MarkerClusterGroup. Out-of-city locations (Girard serving beyond its
 * limits) get a distinct magenta ring; an optional filter shows only those.
 *
 * Wrapped in React.memo: rebuilding ~5,568 markers + the cluster tree is
 * expensive, so this must NOT re-render when unrelated app state (e.g. the
 * selected-location dialog) changes. It re-renders only when locations or the
 * out-of-city filter change. (onSelect is a stable useState setter.)
 */
function AccountMarkers({
  locations = [],
  onSelect,
  outOfCityOnly = false,
}: AccountMarkersProps) {
  const shown = outOfCityOnly ? locations.filter(isOutside) : locations;

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      disableClusteringAtZoom={17}
    >
      {shown.map((loc, i) => {
        const count = loc.accounts.length;
        const outside = isOutside(loc);
        return (
          <CircleMarker
            key={`${loc.lat},${loc.lon},${i}`}
            center={[loc.lat, loc.lon]}
            radius={radiusForCount(count)}
            pathOptions={{
              fillColor: colorForCount(count),
              color: outside ? "#E040FB" : "rgba(255,255,255,0.6)",
              weight: outside ? 2.5 : 1.5,
              opacity: 1,
              fillOpacity: 0.85,
            }}
            eventHandlers={onSelect ? { click: () => onSelect(loc) } : undefined}
          >
            <Tooltip sticky offset={[12, 0]}>
              <span dangerouslySetInnerHTML={{ __html: tooltipHtml(loc) }} />
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MarkerClusterGroup>
  );
}

export default memo(AccountMarkers);
