import { TYPE_COLORS } from "@/data/typeColors";

export default function PokemonCard({ mon, ownedCount, theme, onClick }) {
  const owned = ownedCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-2xl p-3 text-left transition-transform duration-200 active:scale-[0.98] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        background: owned
          ? `color-mix(in srgb, ${theme.ownedTint} 18%, ${theme.card})`
          : theme.card,
        border: `1px solid ${owned ? theme.ownedTint : "var(--app-border)"}`,
      }}
    >
      <div className="flex items-center justify-between h-6">
        <span className="text-sm leading-6" style={{ color: "var(--app-muted)" }}>
          #{mon.num}
        </span>
        {owned && (
          <span
            className="text-sm font-bold leading-5 rounded-full px-2 py-0.5"
            style={{
              background: theme.ownedTint,
              color: "var(--app-on-accent)",
            }}
          >
            {ownedCount}
          </span>
        )}
      </div>

      <div className="w-full aspect-square my-1">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number(mon.num)}.png`}
          alt={mon.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-1"
        />
      </div>

      <div
        className="h-6 leading-6 text-center font-bold text-base truncate"
        style={{ color: theme.text }}
      >
        {mon.name}
      </div>

      {/* room for two chip lines is always reserved, so no card is taller than another */}
      <div className="mt-1.5 h-[52px] flex flex-wrap gap-1 justify-center content-start overflow-hidden">
        {mon.types.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-full text-sm font-bold no-select max-w-full truncate"
            style={{ background: TYPE_COLORS[t] || "#888", color: "#1a1a1a" }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* pinned to the bottom edge of the card */}
      <div className="mt-auto pt-3">
        <span
          className="block w-full rounded-lg py-2.5 text-sm font-bold text-center no-select"
          style={{
            background: "var(--app-accent)",
            color: "var(--app-on-accent)",
          }}
        >
          DETAILS
        </span>
      </div>
    </button>
  );
}