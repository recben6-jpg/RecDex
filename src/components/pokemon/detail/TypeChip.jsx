import { TYPE_COLORS } from "@/data/typeColors";
import { multiplierLabel, multiplierTone } from "@/data/typeChart";

// one type in the effectiveness chart: the type itself, plus how hard a hit of
// it lands when the multiplier is known
export default function TypeChip({ type, multiplier, active = false, onClick }) {
  const tone = multiplier === undefined ? null : multiplierTone(multiplier);

  const style = {
    background: TYPE_COLORS[type] || "#888888",
    color: "#1a1a1a",
    border: `2px solid ${active ? "var(--app-text)" : "transparent"}`,
  };

  const content = (
    <>
      <span className="text-sm font-bold truncate">{type}</span>
      {tone && (
        <span
          className="text-xs font-bold rounded-md px-1.5 py-1 shrink-0 no-select"
          style={{ background: tone, color: "#1a1a1a" }}
        >
          {multiplierLabel(multiplier)}
        </span>
      )}
    </>
  );

  if (!onClick) {
    return (
      <span
        className="flex items-center justify-between gap-1.5 rounded-xl px-2.5 py-1.5 no-select"
        style={style}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center justify-between gap-1.5 rounded-xl px-2.5 py-1.5 no-select focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={style}
    >
      {content}
    </button>
  );
}