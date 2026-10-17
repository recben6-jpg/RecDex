const artwork = (num) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number(num)}.png`;

export default function EvoStageCard({ stage, number }) {
  return (
    <div
      className="w-[7.5rem] shrink-0 flex flex-col items-center gap-1 rounded-2xl p-2"
      style={{
        background: "var(--app-card)",
        border: "1px solid var(--app-border)",
      }}
    >
      {/* how this stage is reached — reserved even when there is no condition */}
      <div className="min-h-[2.25rem] flex items-center justify-center px-0.5">
        {stage.condition && (
          <span
            className="text-[11px] font-bold leading-tight text-center rounded-full px-2 py-0.5 no-select"
            style={{
              background: "var(--app-accent)",
              color: "var(--app-on-accent)",
            }}
          >
            {stage.condition}
          </span>
        )}
      </div>

      <div className="w-full aspect-square">
        {number ? (
          <img
            src={artwork(number)}
            alt={stage.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <div
            className="w-full h-full rounded-xl"
            style={{ background: "var(--app-border)" }}
          />
        )}
      </div>

      <div className="w-full text-center">
        <div className="text-sm font-bold truncate" style={{ color: "var(--app-text)" }}>
          {stage.name}
        </div>
        {number && (
          <div className="text-xs" style={{ color: "var(--app-muted)" }}>
            #{number}
          </div>
        )}
      </div>
    </div>
  );
}