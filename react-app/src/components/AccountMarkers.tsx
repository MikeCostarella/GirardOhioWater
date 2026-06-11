import { CircleMarker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { WaterLocation } from "../types/account";
import { colorForCount, radiusForCount } from "../data/markerStyle";
import { tooltipHtml } from "../data/tooltip";

interface AccountMarkersProps {
  locations?: WaterLocation[];
  /** Called when a marker is clicked (wired to the detail dialog). */
  onSelect?: (loc: WaterLocation) => void;
}

/**
 * One CircleMarker per location, colored + sized by account count, grouped
 * into a MarkerClusterGroup so the ~5.5k points collapse into count badges
 * that split apart as you zoom in. Ported from the prototype's circle loop;
 * clustering is the one deliberate enhancement over the original.
 */
export default function AccountMarkers({ locations = [], onSelect }: AccountMarkersProps) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      disableClusteringAtZoom={17}
    >
      {locations.map((loc, i) => {
        const count = loc.accounts.length;
        return (
          <CircleMarker
            key={`${loc.lat},${loc.lon},${i}`}
            center={[loc.lat, loc.lon]}
            radius={radiusForCount(count)}
            pathOptions={{
              fillColor: colorForCount(count),
              color: "rgba(255,255,255,0.6)",
              weight: 1.5,
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
