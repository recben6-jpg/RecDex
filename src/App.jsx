import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from '@/pages/Home';
import BottomTabs from '@/components/BottomTabs';
import ScreenLoader from '@/components/ScreenLoader';
import { PokedexProvider } from '@/contexts/PokedexProvider';
import { TabStackProvider } from '@/contexts/TabStackProvider';

// each stack screen ships as its own chunk, fetched the first time it is opened
const PokemonDetail = lazy(() => import('@/pages/PokemonDetail'));
const Settings = lazy(() => import('@/pages/Settings'));

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <PokedexProvider>
      <TabStackProvider>
        <AnimatedRoutes />
        <BottomTabs />
      </TabStackProvider>
    </PokedexProvider>
  );
};

// Full-screen stack: detail screens slide in from the right, settings rises up
const layerFor = (pathname) => {
  if (pathname.startsWith('/pokemon/')) {
    return { zIndex: 50, initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };
  }
  if (pathname === '/settings') {
    return { zIndex: 40, initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };
  }
  return { zIndex: 0, initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { zIndex, initial, animate, exit } = layerFor(location.pathname);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={location.pathname}
        className="fixed inset-0"
        style={{ zIndex }}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{
          type: 'tween',
          duration: 0.24,
          ease: 'easeOut',
          // the page underneath holds until the incoming one has covered it
          opacity: { delay: 0.18, duration: 0.06 },
        }}
      >
        <Suspense fallback={<ScreenLoader />}>
          <Routes location={location}>
            {/* Add your page Route elements here */}
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:num" element={<PokemonDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App