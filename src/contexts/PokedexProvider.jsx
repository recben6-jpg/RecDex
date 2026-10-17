import { createContext, useContext } from "react";
import { usePokedexStorage } from "@/hooks/usePokedexStorage";
import { useThemeSettings } from "@/hooks/useThemeSettings";

const PokedexContext = createContext(null);

export function PokedexProvider({ children }) {
  const storage = usePokedexStorage();
  const themeSettings = useThemeSettings();
  const value = { ...storage, ...themeSettings };

  return <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>;
}

export function usePokedex() {
  const ctx = useContext(PokedexContext);
  if (!ctx) throw new Error("usePokedex must be used inside PokedexProvider");
  return ctx;
}