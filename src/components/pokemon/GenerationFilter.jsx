import { GENERATIONS } from "@/data/generations";
import { useDragScroll } from "@/hooks/useDragScroll";

const ITEMS = [
  { value: "all", label: "All gens" },
  ...GENERATIONS.map((g) => ({ value: g.gen, label: `Gen ${g.gen}` })),
];

export default function GenerationFilter({ value, onChange }) {
  const slider = useDragScroll();

  return (
    <div
      ref={slider.ref}
      {...slider.handlers}
      className="tab-slider flex gap-2 px-4 pb-3 no-select cursor-grab"
    >
      {ITEMS.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={active}
            className="shrink-0 touch-pan-x rounded-full px-3.5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: active ? "var(--app-accent)" : "var(--app-card)",
              color: active ? "var(--app-on-accent)" : "var(--app-text)",
              border: `1px solid ${active ? "var(--app-accent)" : "var(--app-border)"}`,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}