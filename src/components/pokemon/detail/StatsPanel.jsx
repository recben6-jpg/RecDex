import ComingSoon from "@/components/pokemon/detail/ComingSoon";

const KEYS = ["hp", "atk", "def", "spa", "spd", "spe"];

export default function StatsPanel({ stats }) {
  if (!stats) return <ComingSoon label="STATS" />;

  return (
    <div className="space-y-3 pt-1">
      {KEYS.map((k) => {
        const value = stats[k];
        return (
          <div key={k} className="flex items-center gap-3">
            <span
              className="text-sm font-bold w-12 no-select"
              style={{ color: "var(--app-muted)" }}
            >
              {k.toUpperCase()}
            </span>
            <div
              className="flex-1 h-3 rounded-full overflow-hidden"
              style={{ background: "var(--app-border)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (value / 255) * 100)}%`,
                  background: "var(--app-accent)",
                }}
              />
            </div>
            <span
              className="text-sm w-16 text-right no-select"
              style={{ color: "var(--app-muted)" }}
            >
              {value}/255
            </span>
          </div>
        );
      })}
    </div>
  );
}