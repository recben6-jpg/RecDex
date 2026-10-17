import { ChevronLeft } from "lucide-react";
import { useDragScroll } from "@/hooks/useDragScroll";

const TABS = ["INFO", "TYPES", "STATS", "MOVES", "EVO", "CARDS"];

export default function DetailHeader({ title, tab, onTabChange, onBack }) {
  const slider = useDragScroll();

  return (
    <div className="shrink-0" style={{ background: "var(--app-accent)" }}>
      <div className="safe-top" />

      <div className="flex items-center gap-1 px-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Pokédex"
          className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full"
          style={{ color: "var(--app-on-accent)" }}
        >
          <ChevronLeft size={28} />
        </button>
        <div
          className="min-w-0 flex-1 text-base font-bold truncate no-select"
          style={{ color: "var(--app-on-accent)" }}
        >
          {title}
        </div>
      </div>

      {/* one line that slides sideways on narrow screens */}
      <div
        ref={slider.ref}
        {...slider.handlers}
        className="tab-slider flex items-stretch gap-2.5 px-3 pb-3 pt-1 cursor-grab"
      >
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onTabChange(t)}
              aria-pressed={active}
              className="shrink-0 touch-pan-x rounded-full px-5 text-sm font-bold tracking-wide no-select"
              style={{
                background: active ? "var(--app-on-accent)" : "rgba(26,26,26,0.07)",
                color: active ? "var(--app-accent)" : "rgba(26,26,26,0.62)",
                border: `1px solid ${
                  active ? "var(--app-on-accent)" : "rgba(26,26,26,0.22)"
                }`,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}