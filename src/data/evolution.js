import { loadAllGenerations, peekAllGenerations } from "@/data/pokemonData";

// "Bulbasaur → Ivysaur (Lv.16) → Venusaur (Lv.32)" becomes one array per step,
// so a step that branches holds several stages to show side by side
const ENTRY = /^(.+?)\s*\((.+)\)$/;

export function parseEvolution(evo) {
  if (!evo || /does not evolve/i.test(evo)) return null;

  const steps = evo
    .split("→")
    .map((step) => step.trim())
    .filter(Boolean);

  if (steps.length < 2) return null;

  return steps.map((step) =>
    step.split(/\s\/\s/).map((entry) => {
      const match = entry.trim().match(ENTRY);
      return {
        name: match ? match[1].trim() : entry.trim(),
        condition: match ? match[2].trim() : null,
      };
    })
  );
}

// name -> dex number for every stage, including stages from other generations
let index = null;

const build = (list) => {
  index = {};
  list.forEach((mon) => {
    index[mon.name] = mon.num;
  });
  return index;
};

export function peekDexIndex() {
  if (index) return index;
  const all = peekAllGenerations();
  return all ? build(all) : null;
}

export function loadDexIndex() {
  if (index) return Promise.resolve(index);
  return loadAllGenerations().then(build);
}