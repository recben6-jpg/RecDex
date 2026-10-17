// Gen 6+ damage relations: how a hit of each attacking type lands on a
// defending type. Types that are not listed take a neutral ×1 hit.
export const ATTACK_CHART = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

export const TYPES = Object.keys(ATTACK_CHART);

export const multiplierFor = (attack, defend) =>
  ATTACK_CHART[attack]?.[defend] ?? 1;

// how a hit of one attacking type lands on a Pokémon with these types
export const defenseMultiplier = (attack, types = []) =>
  types.reduce((total, type) => total * multiplierFor(attack, type), 1);

const LABELS = { 0: "×0", 0.25: "×¼", 0.5: "×½", 1: "×1", 2: "×2", 4: "×4" };

export const multiplierLabel = (multiplier) =>
  LABELS[multiplier] ?? `×${multiplier}`;

export const weaknessOf = (multiplier) =>
  multiplier > 1
    ? "weak"
    : multiplier === 0
      ? "immune"
      : multiplier < 1
        ? "resist"
        : "neutral";

// light tones readable with dark text, in both appearances
export function multiplierTone(multiplier) {
  if (multiplier >= 4) return "#ff5252";
  if (multiplier > 1) return "#ffab91";
  if (multiplier === 0) return "#b0bec5";
  if (multiplier <= 0.25) return "#66bb6a";
  if (multiplier < 1) return "#a5d6a7";
  return "#e0e0e0";
}

// the rows the summary is built from, weakest matchups first
export const SUMMARY_GROUPS = [
  { key: "x4", multiplier: 4, label: "Weak to" },
  { key: "x2", multiplier: 2, label: "Weak to" },
  { key: "x0", multiplier: 0, label: "Immune to" },
  { key: "x_quarter", multiplier: 0.25, label: "Resists" },
  { key: "x_half", multiplier: 0.5, label: "Resists" },
];