import { MapContainer, TileLayer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { InvalidateSize } from "../hooks/useInvalidateSize";
import { MapController } from "../hooks/useMapController";
import AccountMarkers from "./AccountMarkers";
import type { WaterLocation } from "../types/account";

// Map defaults ported verbatim from the prototype's L.map(...) init.
export const MAP_CENTER: [number, number] = [41.1606, -80.6869];
export const MAP_ZOOM = 13;

interface WaterMapProps {
  locations: WaterLocation[];
  onSelect?: (loc: WaterLocation) => void;
  onMapReady?: (map: LeafletMap) => void;
}

/**
 * Base map + account-density markers. Exposes the Leaflet instance via
 * onMapReady so search can flyTo. Center/zoom/tiles match the prototype.
 */
export default function WaterMap({ locations, onSelect, onMapReady }: WaterMapProps) {
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
      {onMapReady && <MapController onReady={onMapReady} />}
    </MapContainer>
  );
}
