import { useCallback, useEffect, useState } from "react";

const KEY = "pokedex-theme-local";

// Full palettes per appearance. The user can still override any of the four
// colours below; everything else follows the appearance (system or picked).
export const PRESETS = {
  dark: {
    background: "#1e1e1e",
    surface: "#141414",
    row: "#2d2d2d",
    card: "#2c2c2c",
    text: "#ffffff",
    border: "#3a3a3a",
    muted: "#a0a0a0",
    accent: "#f9a825",
    onAccent: "#1a1a1a",
    ownedTint: "#00e676",
  },
  light: {
    background: "#f4f5f7",
    surface: "#ffffff",
    row: "#ffffff",
    card: "#ffffff",
    text: "#141414",
    border: "#d8d9dd",
    muted: "#5c5c66",
    accent: "#f9a825",
    onAccent: "#1a1a1a",
    ownedTint: "#00a152",
  },
};

const COLOR_KEYS = ["background", "text", "card", "ownedTint"];
const MODES = ["system", "light", "dark"];

function defaults() {
  return { mode: "system", overrides: {}, perRow: "auto" };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    const overrides = { ...(parsed.overrides || {}) };
    // older versions stored the colours flat; anything differing from the old
    // dark default was a deliberate choice, so keep it as an override
    COLOR_KEYS.forEach((k) => {
      if (typeof parsed[k] === "string" && parsed[k] !== PRESETS.dark[k]) {
        overrides[k] = parsed[k];
      }
    });
    return {
      mode: MODES.includes(parsed.mode) ? parsed.mode : "system",
      overrides,
      perRow: parsed.perRow ?? "auto",
    };
  } catch {
    return defaults();
  }
}

function write(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // storage unavailable - keep the settings for this session only
  }
}

// ---- WCAG contrast check ---------------------------------------------------
// the swatches let any colour be picked, so a palette can end up with text that
// no longer reads on its background - this flags it instead of failing silently
function hexToRgb(hex) {
  if (typeof hex !== "string") return null;
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return null;
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return null;
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

// WCAG 2.1 relative luminance
export function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// returns the ratio (1 - 21) or null when a colour can't be read
export function contrastRatio(colorA, colorB) {
  const a = relativeLuminance(colorA);
  const b = relativeLuminance(colorB);
  if (a === null || b === null) return null;
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

// warns when the background/text pair is below WCAG AA (4.5:1)
export function checkContrast(background, text) {
  const ratio = contrastRatio(background, text);
  if (ratio !== null && ratio < 4.5) {
    console.warn(
      `Low text contrast: ${text} on ${background} is ${ratio.toFixed(2)}:1, below the WCAG AA minimum of 4.5:1.`
    );
  }
  return ratio;
}

export function useThemeSettings() {
  const [systemDark, setSystemDark] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [stored, setStored] = useState(read);

  // follow the device appearance
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const effectiveMode =
    stored.mode === "system" ? (systemDark ? "dark" : "light") : stored.mode;

  const theme = {
    ...PRESETS[effectiveMode],
    ...stored.overrides,
    mode: stored.mode,
    effectiveMode,
    perRow: stored.perRow,
  };

  useEffect(() => {
    write(stored);
  }, [stored]);

  // expose the resolved palette as CSS variables so every surface (and the
  // shadcn primitives) follows the system appearance
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", effectiveMode === "dark");
    root.style.setProperty("--app-bg", theme.background);
    root.style.setProperty("--app-surface", theme.surface);
    root.style.setProperty("--app-row", theme.row);
    root.style.setProperty("--app-card", theme.card);
    root.style.setProperty("--app-text", theme.text);
    root.style.setProperty("--app-border", theme.border);
    root.style.setProperty("--app-muted", theme.muted);
    root.style.setProperty("--app-accent", theme.accent);
    root.style.setProperty("--app-on-accent", theme.onAccent);
    root.style.setProperty("--app-owned", theme.ownedTint);
  }, [
    effectiveMode,
    theme.background,
    theme.surface,
    theme.row,
    theme.card,
    theme.text,
    theme.border,
    theme.muted,
    theme.accent,
    theme.onAccent,
    theme.ownedTint,
  ]);

  // flag a palette whose text no longer reads on its background
  useEffect(() => {
    checkContrast(theme.background, theme.text);
  }, [theme.background, theme.text]);

  const updateTheme = useCallback((patch) => {
    setStored((prev) => {
      const next = { ...prev, overrides: { ...prev.overrides } };
      if (patch.perRow !== undefined) next.perRow = patch.perRow;
      if (patch.mode !== undefined) {
        next.mode = patch.mode;
        next.overrides = {};
      }
      COLOR_KEYS.forEach((k) => {
        if (patch[k] !== undefined) next.overrides[k] = patch[k];
      });
      return next;
    });
  }, []);

  const resetTheme = useCallback(() => setStored(defaults()), []);

  const clearTheme = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setStored(defaults());
  }, []);

  return { theme, updateTheme, resetTheme, clearTheme };
}