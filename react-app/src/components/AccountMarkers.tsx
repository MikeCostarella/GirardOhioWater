import { CircleMarker, Tooltip } from "react-leaflet";
import type { WaterLocation } from "../types/account";
import { colorForCount, radiusForCount } from "../data/markerStyle";
import { tooltipHtml } from "../data/tooltip";

interface AccountMarkersProps {
  locations: WaterLocation[];
  /** Called when a marker is clicked (wired to the detail dialog in a later slice). */
  onSelect?: (loc: WaterLocation) => void;
}

/**
 * One CircleMarker per location, colored + sized by account count.
 * Ported from the prototype's LOCATIONS.forEach(...) circle loop. Tooltips are
 * sticky (follow the cursor) like the original.
 */
export default function AccountMarkers({ locations = [], onSelect }: AccountMarkersProps) {
  return (
    <>
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
    </>
  );
}
