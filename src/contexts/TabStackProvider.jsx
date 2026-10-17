import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const TABS = [
  { root: "/", label: "Home" },
  { root: "/settings", label: "Settings" },
];

const TabStackContext = createContext(null);

// every route belongs to exactly one tab
const tabOf = (pathname) =>
  pathname.startsWith("/settings") ? "/settings" : "/";

export function TabStackProvider({ children }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  // last location seen inside each tab, kept in a ref so it never re-renders
  const stacks = useRef({});

  useEffect(() => {
    stacks.current[tabOf(pathname)] = { pathname, search, hash };
  }, [pathname, search, hash]);

  // switching tabs restores that tab's stack, re-selecting resets it to its root
  const goToTab = useCallback(
    (root) => {
      if (tabOf(pathname) === root) {
        // already at that tab's root - leave history alone
        if (pathname !== root || search || hash) navigate(root);
        return;
      }
      navigate(stacks.current[root] || root);
    },
    [navigate, pathname, search, hash]
  );

  return (
    <TabStackContext.Provider value={{ goToTab }}>
      {children}
    </TabStackContext.Provider>
  );
}

export const useTabStack = () => useContext(TabStackContext);