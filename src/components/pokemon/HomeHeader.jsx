import { Search } from "lucide-react";
import GenerationFilter from "@/components/pokemon/GenerationFilter";

export default function HomeHeader({
  query,
  onQueryChange,
  ownedCount = 0,
  totalCount = 0,
  gen,
  onGenChange,
}) {
  return (
    <header
      className="shrink-0 safe-top"
      style={{
        background: "var(--app-bg)",
        borderBottom: "1px solid var(--app-border)",
      }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <h1
          className="text-lg font-bold whitespace-nowrap"
          style={{ color: "var(--app-text)" }}
        >
          Pokédex
        </h1>

        <div className="relative flex-1 max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--app-muted)" }}
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search #dex, name, type…"
            aria-label="Search Pokémon by number, name, or type"
            className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm outline-none"
            style={{
              background: "var(--app-card)",
              color: "var(--app-text)",
              border: "1px solid var(--app-border)",
            }}
          />
        </div>

        <span
          className="text-sm whitespace-nowrap"
          style={{ color: "var(--app-muted)" }}
        >
          {ownedCount}/{totalCount}
        </span>
      </div>

      <GenerationFilter value={gen} onChange={onGenChange} />
    </header>
  );
}