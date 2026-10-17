import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ComingSoon from "@/components/pokemon/detail/ComingSoon";
import EvoStageCard from "@/components/pokemon/detail/EvoStageCard";
import { loadDexIndex, parseEvolution, peekDexIndex } from "@/data/evolution";

export default function EvoPanel({ evo }) {
  const [dexIndex, setDexIndex] = useState(() => peekDexIndex());

  // every stage's artwork needs its dex number, including cross-generation stages
  useEffect(() => {
    if (dexIndex) return;
    let cancelled = false;
    loadDexIndex().then((index) => {
      if (!cancelled) setDexIndex(index);
    });
    return () => {
      cancelled = true;
    };
  }, [dexIndex]);

  if (!evo) return <ComingSoon label="EVO" />;

  const steps = parseEvolution(evo);

  if (!steps) {
    return (
      <p
        className="text-sm py-10 text-center"
        style={{ color: "var(--app-muted)" }}
      >
        This Pokémon doesn’t evolve.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 pt-1">
      {steps.map((stageGroup, i) => (
        <div key={i} className="w-full flex flex-col items-center gap-2">
          {i > 0 && (
            <ChevronDown size={22} style={{ color: "var(--app-muted)" }} />
          )}
          <div className="w-full flex flex-wrap justify-center gap-2">
            {stageGroup.map((stage) => (
              <EvoStageCard
                key={stage.name}
                stage={stage}
                number={dexIndex?.[stage.name]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}