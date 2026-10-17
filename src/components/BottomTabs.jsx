import { Home as HomeIcon, Settings as SettingsIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePokedex } from "@/contexts/PokedexProvider";
import { TABS, useTabStack } from "@/contexts/TabStackProvider";

const ICONS = {
  "/": HomeIcon,
  "/settings": SettingsIcon,
};

export default function BottomTabs() {
  const { pathname } = useLocation();
  const { goToTab } = useTabStack();
  const { theme } = usePokedex();

  // the stack screens (detail) cover the tab bar; it only lives on tab screens
  if (pathname !== "/" && pathname !== "/settings") return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex"
      style={{
        background: "var(--app-surface)",
        borderTop: "1px solid var(--app-border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map(({ root, label }) => {
        const Icon = ICONS[root];
        const active = pathname === root;
        return (
          <button
            key={root}
            type="button"
            onClick={() => goToTab(root)}
            aria-current={active ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ color: active ? "var(--app-accent)" : "var(--app-muted)" }}
          >
            <Icon size={22} />
            <span className="text-sm font-bold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}