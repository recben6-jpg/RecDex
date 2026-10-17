import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "@/components/pokemon/HomeHeader";
import PokemonGrid from "@/components/pokemon/PokemonGrid";
import PullToRefresh from "@/components/pokemon/PullToRefresh";
import { usePokedex } from "@/contexts/PokedexProvider";
import {
  loadAllGenerations,
  loadGeneration,
  peekAllGenerations,
  peekGeneration,
} from "@/data/pokemonData";

// search, filter and scroll position survive a trip to a detail screen
const view = { query: "", gen: "all", scrollTop: 0 };

// data already in memory for the generation on screen, if any
const peek = (gen) =>
  gen === "all" ? peekAllGenerations() : peekGeneration(gen);

export default function Home() {
  const navigate = useNavigate();
  const { owned, theme, reload } = usePokedex();
  const [query, setQuery] = useState(view.query);
  const [gen, setGen] = useState(view.gen);
  // only the selected generation's data is held in memory
  const [mons, setMons] = useState(() => peek(view.gen) || []);
  const [loading, setLoading] = useState(() => !peek(view.gen));
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const cached = peek(gen);
    if (cached) {
      setMons(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    const request = gen === "all" ? loadAllGenerations() : loadGeneration(gen);
    request.then((list) => {
      if (cancelled) return;
      setMons(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [gen]);

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return mons;
    // every term must match the name, number, or a type — so searching
    // "charmander fire" narrows to Pokémon that are both Charmander and Fire.
    // a slash-separated number list (e.g. "223/151" or "#223/151") matches any
    // of those Pokédex numbers.
    return mons.filter((p) =>
      tokens.every((token) => {
        const numParts = token.replace(/^#/, "").split("/").filter(Boolean);
        if (numParts.length > 1 && numParts.every((np) => /^\d+$/.test(np))) {
          const nums = new Set(numParts.map((np) => parseInt(np, 10)));
          return nums.has(parseInt(p.num, 10));
        }
        const numQ = token.replace(/^#/, "");
        return (
          p.name.toLowerCase().includes(token) ||
          p.num.includes(numQ) ||
          p.types.some((t) => t.toLowerCase().includes(token))
        );
      })
    );
  }, [query, mons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = view.scrollTop;
  }, []);

  const handleQuery = (value) => {
    view.query = value;
    setQuery(value);
  };

  const handleGen = (value) => {
    view.gen = value;
    setGen(value);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--app-bg)" }}>
      <HomeHeader
        query={query}
        onQueryChange={handleQuery}
        ownedCount={filtered.filter((p) => (owned[p.num] || 0) > 0).length}
        totalCount={filtered.length}
        gen={gen}
        onGenChange={handleGen}
      />

      <PullToRefresh
        containerRef={scrollRef}
        onRefresh={reload}
        className="flex-1 min-h-0"
        onScroll={(e) => {
          view.scrollTop = e.currentTarget.scrollTop;
        }}
      >
        <PokemonGrid
          mons={filtered}
          loading={loading}
          owned={owned}
          theme={theme}
          scrollRef={scrollRef}
          initialScrollTop={view.scrollTop}
          onSelect={(mon) => navigate(`/pokemon/${mon.num}`)}
        />
      </PullToRefresh>
    </div>
  );
}