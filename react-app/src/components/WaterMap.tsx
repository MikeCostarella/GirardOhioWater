import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { InvalidateSize } from "../hooks/useInvalidateSize";
import AccountMarkers from "./AccountMarkers";
import type { WaterLocation } from "../types/account";

// Map defaults ported verbatim from the prototype's L.map(...) init.
export const MAP_CENTER: [number, number] = [41.1606, -80.6869];
export const MAP_ZOOM = 13;

interface WaterMapProps {
  locations: WaterLocation[];
  onSelect?: (loc: WaterLocation) => void;
}

/**
 * The base map plus account-density markers. Dialog/search/legend attach in
 * later Phase 3 slices. Center/zoom/tile URL/attribution match the prototype.
 */
export default function WaterMap({ locations, onSelect }: WaterMapProps) {
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
      <AccountMarkers locations={locations} onSelect={onSelect} />
      <InvalidateSize />
    </MapContainer>
  );
}
