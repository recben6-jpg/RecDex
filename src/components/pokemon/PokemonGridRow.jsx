import { forwardRef } from "react";
import PokemonCard from "@/components/pokemon/PokemonCard";

// one line of the grid; the parent positions it and decides which cards it holds
const PokemonGridRow = forwardRef(function PokemonGridRow(
  { mons, owned, theme, onSelect, cols, gap = 12, hidden = false, style },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden={hidden || undefined}
      className="absolute left-0 right-0 grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        visibility: hidden ? "hidden" : undefined,
        pointerEvents: hidden ? "none" : undefined,
        ...style,
      }}
    >
      {mons.map((mon) => (
        <PokemonCard
          key={mon.num}
          mon={mon}
          ownedCount={owned[mon.num] || 0}
          theme={theme}
          onClick={() => onSelect(mon)}
        />
      ))}
    </div>
  );
});

export default PokemonGridRow;