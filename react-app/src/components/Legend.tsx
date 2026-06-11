import { useState } from "react";
import { DENSITY_LEGEND } from "../data/markerStyle";

/**
 * Bottom-right "Account Density" key explaining the marker colors.
 * Collapsible via the header toggle, like the prototype. Renders from
 * DENSITY_LEGEND so the swatches always match the marker ramp.
 */
export default function Legend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div id="legend" className={collapsed ? "collapsed" : ""}>
      <div id="legend-header" onClick={() => setCollapsed((c) => !c)}>
        <span>Account Density</span>
        <span id="legend-toggle">{collapsed ? "\u25B2" : "\u25BC"}</span>
      </div>
      {!collapsed && (
        <div id="legend-body">
          {DENSITY_LEGEND.map((row) => (
            <div className="legend-row" key={row.label}>
              <span className="legend-dot" style={{ background: row.color }} />
              {row.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
