import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { TYPE_COLORS } from "@/data/typeColors";

const imgUrlFor = (num) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number(num)}.png`;

function Label({ children }) {
  return (
    <div
      className="text-sm uppercase tracking-wide"
      style={{ color: "var(--app-muted)" }}
    >
      {children}
    </div>
  );
}

function Box({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl p-3 ${className}`}
      style={{
        background: "var(--app-card)",
        border: "1px solid var(--app-border)",
      }}
    >
      {children}
    </div>
  );
}

export default function PokemonInfoPanel({
  mon,
  ownedCount,
  note,
  theme,
  onOwnedChange,
  onNoteChange,
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [mon.num]);

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <Box className="flex items-center gap-4">
        <div className="aspect-square w-[40%] max-w-[150px] shrink-0 flex items-center justify-center">
          {imgError ? (
            <span
              className="text-xl font-bold"
              style={{ color: "var(--app-muted)" }}
            >
              #{mon.num}
            </span>
          ) : (
            <img
              src={imgUrlFor(mon.num)}
              alt={mon.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div
          className="flex-1 min-w-0 text-2xl font-bold leading-tight break-words no-select"
          style={{ color: theme.text }}
        >
          {mon.name}
        </div>
      </Box>

      <div className="grid grid-cols-2 gap-3">
        <Box>
          <Label>Dex No.</Label>
          <div className="text-2xl font-bold" style={{ color: theme.text }}>
            #{mon.num}
          </div>
        </Box>

        <Box>
          <Label>Owned</Label>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => onOwnedChange(mon.num, ownedCount - 1)}
              disabled={ownedCount <= 0}
              className="w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-30 shrink-0"
              style={{ background: "var(--app-row)", color: "var(--app-text)" }}
              aria-label="Decrease owned"
            >
              <Minus size={20} />
            </button>
            <span
              className="text-2xl font-bold flex-1 text-center"
              style={{ color: theme.text }}
            >
              {ownedCount}
            </span>
            <button
              type="button"
              onClick={() => onOwnedChange(mon.num, ownedCount + 1)}
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "var(--app-accent)",
                color: "var(--app-on-accent)",
              }}
              aria-label="Increase owned"
            >
              <Plus size={20} />
            </button>
          </div>
        </Box>
      </div>

      <Box>
        <Label>Type</Label>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {mon.types.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-sm font-bold no-select"
              style={{ background: TYPE_COLORS[t] || "#888", color: "#1a1a1a" }}
            >
              {t}
            </span>
          ))}
        </div>
      </Box>

      <Box className="flex-1 flex flex-col min-h-[150px]">
        <div className="text-base font-bold mb-2" style={{ color: theme.text }}>
          NOTES
        </div>
        <textarea
          value={note || ""}
          onChange={(e) => onNoteChange(mon.num, e.target.value)}
          placeholder="e.g. 2x normal old, 3x new 2025..."
          className="flex-1 w-full rounded-lg p-3 text-sm resize-none outline-none border"
          style={{
            background: "var(--app-bg)",
            borderColor: "var(--app-border)",
            color: "var(--app-text)",
          }}
        />
      </Box>
    </div>
  );
}