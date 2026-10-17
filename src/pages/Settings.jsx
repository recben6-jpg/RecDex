import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePokedex } from "@/contexts/PokedexProvider";
import SettingsRow from "@/components/settings/SettingsRow";
import ColorSwatch from "@/components/settings/ColorSwatch";
import PerRowSheet from "@/components/settings/PerRowSheet";
import DeleteAccountButton from "@/components/settings/DeleteAccountButton";

const MODES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const PER_ROW_LABEL = {
  auto: "Auto",
  "2": "2 per row",
  "3": "3 per row",
  "4": "4 per row",
  "5": "5 per row",
};

export default function Settings() {
  const navigate = useNavigate();
  const { theme, updateTheme, resetTheme } = usePokedex();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") navigate("/");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--app-bg)" }}>
      <div className="shrink-0" style={{ background: "var(--app-accent)" }}>
        <div className="safe-top" />
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back to Pokédex"
            className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full"
            style={{ color: "var(--app-on-accent)" }}
          >
            <ChevronLeft size={28} />
          </button>
          <span
            className="text-base font-bold no-select"
            style={{ color: "var(--app-on-accent)" }}
          >
            Settings
          </span>
        </div>
      </div>

      <div className="app-scroll flex-1 min-h-0 overflow-y-auto tab-bar-space">
        <div className="w-full max-w-lg mx-auto p-4 flex flex-col gap-3">
          <SettingsRow label="Appearance" stacked>
            <div
              className="flex rounded-full p-1 no-select"
              style={{
                background: "var(--app-card)",
                border: "1px solid var(--app-border)",
              }}
            >
              {MODES.map((m) => {
                const active = theme.mode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => updateTheme({ mode: m.value })}
                    className="flex-1 px-3 py-2 text-sm font-bold rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    style={{
                      background: active ? "var(--app-accent)" : "transparent",
                      color: active
                        ? "var(--app-on-accent)"
                        : "var(--app-text)",
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </SettingsRow>

          <SettingsRow label="Background">
            <ColorSwatch
              label="Background colour"
              value={theme.background}
              onChange={(v) => updateTheme({ background: v })}
            />
          </SettingsRow>

          <SettingsRow label="Text">
            <ColorSwatch
              label="Text colour"
              value={theme.text}
              onChange={(v) => updateTheme({ text: v })}
            />
          </SettingsRow>

          <SettingsRow label="Pokémon Box">
            <ColorSwatch
              label="Box colour"
              value={theme.card}
              onChange={(v) => updateTheme({ card: v })}
            />
          </SettingsRow>

          <SettingsRow label="Owned Tint">
            <ColorSwatch
              label="Owned tint colour"
              value={theme.ownedTint}
              onChange={(v) => updateTheme({ ownedTint: v })}
            />
          </SettingsRow>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: "var(--app-row)",
              border: "1px solid var(--app-border)",
            }}
          >
            <span
              className="text-sm font-bold uppercase tracking-wide no-select"
              style={{ color: "var(--app-text)" }}
            >
              Pokémon Per Row
            </span>
            <span
              className="flex items-center gap-1 text-base font-bold no-select"
              style={{ color: "var(--app-text)" }}
            >
              {PER_ROW_LABEL[theme.perRow] ?? "Auto"}
              <ChevronRight size={20} style={{ color: "var(--app-muted)" }} />
            </span>
          </button>

          <button
            type="button"
            onClick={resetTheme}
            className="w-full rounded-xl py-4 text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: "var(--app-accent)",
              color: "var(--app-on-accent)",
            }}
          >
            RESET
          </button>

          <div className="mt-4 flex flex-col gap-2">
            <span
              className="text-sm uppercase tracking-wide"
              style={{ color: "var(--app-muted)" }}
            >
              Account
            </span>
            <DeleteAccountButton />
          </div>
        </div>
      </div>

      <PerRowSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        value={theme.perRow}
        onSelect={(v) => {
          updateTheme({ perRow: v });
          setSheetOpen(false);
        }}
      />
    </div>
  );
}