// Small, dependency-free hex color helpers used to turn the admin's
// theme color picks into CSS variables at request time.

export function hexToRgbTriplet(hex: string): string {
  const clean = normalizeHex(hex);
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

// Blends a hex color toward white — used to derive a lighter "soft"
// variant of each brand color automatically (used for text on dark bg).
export function lightenHex(hex: string, amount = 0.35): string {
  const clean = normalizeHex(hex);
  const num = parseInt(clean, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function normalizeHex(hex: string): string {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return clean.split("").map((c) => c + c).join("");
  }
  return clean.padEnd(6, "0").slice(0, 6);
}
