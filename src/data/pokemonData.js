import { GENERATIONS, genOf } from "@/data/generations";

// one chunk per generation: nothing is fetched until a view asks for it
const LOADERS = {
  1: () => import("@/data/pokemon/gen1.json"),
  2: () => import("@/data/pokemon/gen2.json"),
  3: () => import("@/data/pokemon/gen3.json"),
  4: () => import("@/data/pokemon/gen4.json"),
  5: () => import("@/data/pokemon/gen5.json"),
  6: () => import("@/data/pokemon/gen6.json"),
  7: () => import("@/data/pokemon/gen7.json"),
  8: () => import("@/data/pokemon/gen8.json"),
  9: () => import("@/data/pokemon/gen9.json"),
};

const data = {}; // resolved lists
const pending = {}; // in-flight loads

export function loadGeneration(gen) {
  const key = String(gen);
  if (!LOADERS[key]) return Promise.resolve([]);
  if (!pending[key]) {
    pending[key] = LOADERS[key]().then((mod) => {
      data[key] = mod.default || [];
      return data[key];
    });
  }
  return pending[key];
}

export function loadAllGenerations() {
  return Promise.all(GENERATIONS.map((g) => loadGeneration(g.gen))).then((lists) =>
    lists.flat()
  );
}

// already-loaded data, so a screen can paint without waiting for a chunk
export function peekGeneration(gen) {
  return data[String(gen)] || null;
}

export function peekAllGenerations() {
  const lists = GENERATIONS.map((g) => data[String(g.gen)]);
  return lists.every(Boolean) ? lists.flat() : null;
}

// null = looked up and absent, undefined = that generation is not loaded yet
export function peekPokemon(num) {
  const list = data[String(genOf(num))];
  if (!list) return undefined;
  return list.find((p) => p.num === num) || null;
}

export function findPokemon(num) {
  return loadGeneration(genOf(num)).then(
    (list) => list.find((p) => p.num === num) || null
  );
}