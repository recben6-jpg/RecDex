export const GENERATIONS = [
  { gen: 1, min: 1, max: 151 },
  { gen: 2, min: 152, max: 251 },
  { gen: 3, min: 252, max: 386 },
  { gen: 4, min: 387, max: 493 },
  { gen: 5, min: 494, max: 649 },
  { gen: 6, min: 650, max: 721 },
  { gen: 7, min: 722, max: 809 },
  { gen: 8, min: 810, max: 905 },
  { gen: 9, min: 906, max: 1025 },
];

export function genOf(num) {
  const n = Number(num);
  const match = GENERATIONS.find((g) => n >= g.min && n <= g.max);
  return match ? match.gen : null;
}