import type { WaterLocation } from "../types/account";

/**
 * Tooltip HTML for a location marker, ported from the prototype's makeTooltip().
 * Single-account locations show the address + account number; multi-account
 * locations show the first street and an account count.
 */
export function tooltipHtml(loc: WaterLocation): string {
  const accts = loc.accounts;
  if (accts.length === 1) {
    const a = accts[0];
    return `<b>${a.street}</b><br>${a.city}, ${a.state} ${a.zip}<br><span style="color:#5bc4f5">Acct: ${a.acct}</span>`;
  }
  const streets = [...new Set(accts.map((a) => a.street))];
  return `<b>${streets[0]}</b>${streets.length > 1 ? " + more" : ""}<br><span style="color:#FF9800"><b>${accts.length} accounts</b></span>`;
}
