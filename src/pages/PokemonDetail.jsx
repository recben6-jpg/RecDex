import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import DetailHeader from "@/components/pokemon/detail/DetailHeader";
import StatsPanel from "@/components/pokemon/detail/StatsPanel";
import TypesPanel from "@/components/pokemon/detail/TypesPanel";
import MovesPanel from "@/components/pokemon/detail/MovesPanel";
import EvoPanel from "@/components/pokemon/detail/EvoPanel";
import ComingSoon from "@/components/pokemon/detail/ComingSoon";
import PokemonInfoPanel from "@/components/pokemon/PokemonInfoPanel";
import ScreenLoader from "@/components/ScreenLoader";
import { usePokedex } from "@/contexts/PokedexProvider";
import { findPokemon, peekPokemon } from "@/data/pokemonData";

export default function PokemonDetail() {
  const { num } = useParams();
  const navigate = useNavigate();
  const { owned, notes, theme, setOwnedCount, setNote } = usePokedex();
  const [tab, setTab] = useState("INFO");
  const [mon, setMon] = useState(() => peekPokemon(num) ?? null);
  const [loadingMon, setLoadingMon] = useState(
    () => peekPokemon(num) === undefined
  );

  // only the generation this Pokémon belongs to is loaded
  useEffect(() => {
    let cancelled = false;
    if (peekPokemon(num) === undefined) setLoadingMon(true);
    findPokemon(num).then((found) => {
      if (cancelled) return;
      setMon(found);
      setLoadingMon(false);
    });
    return () => {
      cancelled = true;
    };
  }, [num]);

  const goBack = useCallback(() => navigate("/"), [navigate]);

  useEffect(() => {
    setTab("INFO");
  }, [num]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") goBack();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goBack]);

  if (loadingMon) return <ScreenLoader />;

  if (!mon) {
    return (
      <div className="h-full flex flex-col" style={{ background: "var(--app-bg)" }}>
        <DetailHeader title="Not found" tab="" onTabChange={() => {}} onBack={goBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-base" style={{ color: "var(--app-muted)" }}>
            That Pokémon isn’t in this Pokédex.
          </p>
          <button
            type="button"
            onClick={goBack}
            className="rounded-xl px-5 py-3 text-base font-bold"
            style={{
              background: "var(--app-accent)",
              color: "var(--app-on-accent)",
            }}
          >
            Back to Pokédex
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--app-bg)" }}>
      <DetailHeader
        title={`#${mon.num} ${mon.name}`}
        tab={tab}
        onTabChange={setTab}
        onBack={goBack}
      />

      <div className="flex-1 min-h-0 w-full">
        <div className="app-scroll overflow-y-auto h-full safe-bottom">
          <div className="w-full max-w-3xl mx-auto p-4 flex flex-col min-h-full">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="flex-1 flex flex-col min-h-0"
              >
                {tab === "INFO" && (
                  <PokemonInfoPanel
                    mon={mon}
                    ownedCount={owned[mon.num] || 0}
                    note={notes[mon.num]}
                    theme={theme}
                    onOwnedChange={setOwnedCount}
                    onNoteChange={setNote}
                  />
                )}
                {tab === "TYPES" && <TypesPanel types={mon.types} />}
                {tab === "STATS" && <StatsPanel stats={mon.stats} />}
                {tab === "MOVES" && <MovesPanel moves={mon.moves} />}
                {tab === "EVO" && <EvoPanel evo={mon.evo} />}
                {tab === "CARDS" && <ComingSoon label="CARDS" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}