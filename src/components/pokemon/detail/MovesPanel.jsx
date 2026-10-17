import ComingSoon from "@/components/pokemon/detail/ComingSoon";

export default function MovesPanel({ moves }) {
  if (!moves?.length) return <ComingSoon label="MOVES" />;

  return (
    <div>
      <div
        className="text-sm uppercase tracking-wide mb-2"
        style={{ color: "var(--app-muted)" }}
      >
        Level-up moves
      </div>
      <ul className="space-y-2">
        {moves.map((move) => (
          <li
            key={move}
            className="text-base py-3 px-4 rounded-xl"
            style={{
              background: "var(--app-card)",
              border: "1px solid var(--app-border)",
              color: "var(--app-text)",
            }}
          >
            {move}
          </li>
        ))}
      </ul>
    </div>
  );
}