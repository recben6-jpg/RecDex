import PokemonGridRow from "@/components/pokemon/PokemonGridRow";
import ScreenLoader from "@/components/ScreenLoader";
import useGridWindow from "@/hooks/useGridWindow";

export default function PokemonGrid({
  mons,
  owned,
  theme,
  onSelect,
  loading = false,
  scrollRef,
  initialScrollTop = 0,
}) {
  const { wrapRef, probeRef, cols, gap, stride, totalHeight, start, end } =
    useGridWindow({
      count: mons.length,
      perRow: theme.perRow,
      scrollRef,
      initialScrollTop,
    });

  if (loading) return <ScreenLoader className="min-h-[70vh] tab-bar-space" />;

  if (mons.length === 0) {
    return (
      <p
        className="text-center py-20 text-sm tab-bar-space"
        style={{ color: "var(--app-muted)" }}
      >
        No Pokémon found.
      </p>
    );
  }

  const rowProps = { owned, theme, onSelect, cols, gap };
  const rows = [];
  for (let r = start; r < end; r += 1) {
    rows.push(
      <PokemonGridRow
        key={r}
        mons={mons.slice(r * cols, r * cols + cols)}
        style={{ top: r * stride }}
        {...rowProps}
      />
    );
  }

  return (
    <div className="p-4 tab-bar-space">
      <div ref={wrapRef} className="relative" style={{ height: totalHeight }}>
        {/* hidden twin of a real row, only rendered to be measured */}
        <PokemonGridRow
          ref={probeRef}
          mons={mons.slice(0, cols)}
          hidden
          {...rowProps}
        />
        {rows}
      </div>
    </div>
  );
}