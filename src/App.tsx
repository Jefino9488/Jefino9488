import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

// Lazy load route components for code splitting
const Home = lazy(() => import("./components/Home"));
const BlogList = lazy(() => import("./components/BlogList"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const About = lazy(() => import("./components/About"));
const Projects = lazy(() => import("./components/Projects"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const Certificates = lazy(() => import("./components/Certificates"));
const NotFound = lazy(() => import("./components/NotFound"));

// Keep critical components eagerly loaded
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import TransitionWrapper from "./components/TransitionWrapper";
import { ProjectsProvider } from "./components/ProjectsContext";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { GitHubProvider } from "@/components/GitHubContext.tsx";
import { isLightRoute } from "@/lib/lightRoutes";

import ErrorBoundary from "./components/ErrorBoundary";
import NetworkErrorBoundary from "./components/NetworkErrorBoundary";
const Background = lazy(() => import("./components/Background"));

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

function DeferredBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const deferredWindow = window as IdleWindow;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const shouldDelayForNetwork =
      Boolean(connection?.saveData) ||
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g";

    const fallbackDelay = isMobile || shouldDelayForNetwork ? 1500 : 400;
    const idleTimeout = isMobile || shouldDelayForNetwork ? 2000 : 800;

    if (hasReducedMotion) {
      setReady(true);
      return;
    }

    if (typeof deferredWindow.requestIdleCallback === "function") {
      const id = deferredWindow.requestIdleCallback(() => setReady(true), {
        timeout: idleTimeout,
      });
      return () => {
        if (typeof deferredWindow.cancelIdleCallback === "function") {
          deferredWindow.cancelIdleCallback(id);
        }
      };
    }

    const timeoutId = window.setTimeout(() => setReady(true), fallbackDelay);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <Background />
    </Suspense>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[85] h-px origin-left bg-gradient-to-r from-primary/50 via-primary to-primary/50"
    />
  );
}

function AppContent() {
  useSmoothScroll();
  const location = useLocation();

  return (
    <div className="relative flex min-h-dvh selection:bg-primary/20 selection:text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div aria-hidden className="grain-overlay" />
      <Cursor />
      <ScrollProgress />
      <DeferredBackground />

      {/* Main Content Area — the light-scope lives HERE (not on each page)
          so the fixed nav's translucent backdrop blends into sage, not the
          dark canvas; transition-colors eases the flip between routes */}
      <div
        className={`flex min-h-dvh w-full flex-col transition-colors duration-500 ${
          isLightRoute(location.pathname) ? "theme-light bg-sage" : ""
        }`}
      >
        {/* Floating Island Navigation (Desktop + Mobile) */}
        <Navbar />

        <main
          id="main-content"
          className="flex-grow overflow-x-clip pt-20 lg:pt-24"
        >
          <Suspense fallback={<Loader />}>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <TransitionWrapper>
                      <Home />
                    </TransitionWrapper>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <TransitionWrapper>
                      <BlogList />
                    </TransitionWrapper>
                  }
                />
                <Route
                  path="/blog/:id"
                  element={
                    <TransitionWrapper>
                      <BlogPost />
                    </TransitionWrapper>
                  }
                />

                <Route
                  path="/about"
                  element={
                    <TransitionWrapper>
                      <About />
                    </TransitionWrapper>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <TransitionWrapper>
                      <Projects />
                    </TransitionWrapper>
                  }
                />
                <Route
                  path="/projects/:name"
                  element={
                    <TransitionWrapper>
                      <ProjectDetail />
                    </TransitionWrapper>
                  }
                />
                <Route
                  path="/certificates"
                  element={
                    <TransitionWrapper>
                      <Certificates />
                    </TransitionWrapper>
                  }
                />
                <Route
                  path="*"
                  element={
                    <TransitionWrapper>
                      <NotFound />
                    </TransitionWrapper>
                  }
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        if (import.meta.env.DEV) {
          console.error(
            "App Error Boundary caught an error:",
            error,
            errorInfo,
          );
        }
      }}
    >
      <NetworkErrorBoundary>
        <Router>
          <ProjectsProvider>
            <GitHubProvider>
              <AppContent />
            </GitHubProvider>
          </ProjectsProvider>
        </Router>
      </NetworkErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;
