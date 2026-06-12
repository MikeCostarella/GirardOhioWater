import { useEffect, useRef, useState } from "react";
import type { JurisdictionCount } from "../data/loadLocations";

interface JurisdictionFilterProps {
  options: JurisdictionCount[];
  /** Set of currently-selected jurisdiction names. */
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}

/**
 * Multi-select dropdown for filtering map locations by jurisdiction. The button
 * shows a summary; the panel lists each jurisdiction with its location count
 * plus Select all / Clear all. Closes on outside click or Escape.
 */
export default function JurisdictionFilter({
  options,
  selected,
  onChange,
}: JurisdictionFilterProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const total = options.length;
  const n = selected.size;
  const summary =
    n === 0
      ? "No jurisdictions"
      : n === total
        ? "All jurisdictions"
        : n === 1
          ? [...selected][0]
          : `${n} of ${total} jurisdictions`;

  const toggle = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange(next);
  };

  return (
    <div className="jur-filter" ref={rootRef}>
      <button
        className="jur-filter-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Jurisdiction: <b>{summary}</b> <span className="jur-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="jur-filter-panel">
          <div className="jur-filter-actions">
            <button onClick={() => onChange(new Set(options.map((o) => o.name)))}>
              Select all
            </button>
            <button onClick={() => onChange(new Set())}>Clear all</button>
          </div>
          <div className="jur-filter-list">
            {options.map((o) => (
              <label className="jur-filter-row" key={o.name}>
                <input
                  type="checkbox"
                  checked={selected.has(o.name)}
                  onChange={() => toggle(o.name)}
                />
                <span className="jur-filter-name">{o.name}</span>
                <span className="jur-filter-count">{o.count.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
