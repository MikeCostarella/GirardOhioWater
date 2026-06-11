import { useEffect, useState } from "react";
import type { WaterLocation } from "./types/account";
import { loadLocations, countAccounts } from "./data/loadLocations";

/**
 * Phase 1 shell. This deliberately renders almost nothing beyond proof that the
 * data seam works and the app compiles + deploys. Feature porting (map, markers,
 * dialog, search, legend) happens in Phase 3, one commit per slice.
 */
export default function App() {
  const [locations, setLocations] = useState<WaterLocation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations()
      .then(setLocations)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--text-accent)", fontSize: "1.4em", letterSpacing: 1 }}>
        &#128204; Girard Ohio Water Accounts Map
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.8em", marginTop: 4 }}>
        Interactive mapping of municipal water service accounts
      </p>

      <div style={{ marginTop: "1.5rem", color: "var(--text-muted-2)", fontSize: "0.9em" }}>
        {error && <span style={{ color: "#F44336" }}>Error: {error}</span>}
        {!error && !locations && <span>Loading account data&hellip;</span>}
        {locations && (
          <span>
            Loaded <b style={{ color: "var(--text-accent)" }}>
              {locations.length.toLocaleString()}
            </b>{" "}
            locations /{" "}
            <b style={{ color: "var(--text-accent)" }}>
              {countAccounts(locations).toLocaleString()}
            </b>{" "}
            accounts. Map UI lands in Phase 3.
          </span>
        )}
      </div>
    </div>
  );
}
