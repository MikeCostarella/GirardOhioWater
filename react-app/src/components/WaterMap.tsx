import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { InvalidateSize } from "../hooks/useInvalidateSize";

// Map defaults ported verbatim from the prototype's L.map(...) init.
export const MAP_CENTER: [number, number] = [41.1606, -80.6869];
export const MAP_ZOOM = 13;

/**
 * The base map. Markers, overlays, search, etc. attach in later Phase 3 slices.
 * Center/zoom/tile URL/attribution match the original single-file prototype.
 */
export default function WaterMap() {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      zoomControl={true}
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      <InvalidateSize />
    </MapContainer>
  );
}
