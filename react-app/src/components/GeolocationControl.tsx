import { useCallback, useEffect, useRef, useState } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import { userLocationIcon } from "../data/userLocationIcon";

/**
 * Requests the user's location on mount and drops a pulsing "You are here"
 * marker with a permanent tooltip, flying the map to it. A round locate button
 * (bottom-right) re-triggers on demand. If permission is denied or the browser
 * has no geolocation, it silently keeps the current view.
 *
 * Ported from the Hydrants geolocation feature; styled to the water theme.
 */
export default function GeolocationControl() {
  const map = useMap();
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [acc, setAcc] = useState<number | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const ll: [number, number] = [p.coords.latitude, p.coords.longitude];
        setPos(ll);
        setAcc(p.coords.accuracy);
        map.flyTo(ll, 16, { animate: true, duration: 1 });
      },
      () => {
        /* denied / unavailable — keep current view silently */
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [map]);

  // Request once on mount.
  useEffect(() => {
    locate();
  }, [locate]);

  return (
    <>
      {pos && (
        <Marker position={pos} icon={userLocationIcon} ref={markerRef}>
          <Tooltip permanent direction="top" offset={[0, -12]} className="user-loc-tip">
            You are here
            {acc != null && <> ({Math.round(acc)} m)</>}
          </Tooltip>
        </Marker>
      )}
      <button
        id="locate-btn"
        title="Find my location"
        aria-label="Find my location"
        onClick={locate}
      >
        &#9678;
      </button>
    </>
  );
}
