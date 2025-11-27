import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";

import About from "./components/About";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import TransitionWrapper from "./components/TransitionWrapper";
import { ProjectsProvider } from "./components/ProjectsContext";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import FloatingActionButton from "@/components/ChatBot/FloatingActionButton.tsx";
import ChatBot from "@/components/ChatBot/ChatBot.tsx";
import { ChatProvider } from "@/components/ChatBot/ChatContext.tsx";
import { GitHubProvider } from "@/components/GitHubContext.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkErrorBoundary from "./components/NetworkErrorBoundary";

function AppContent() {
    useSmoothScroll();

    return (
        <div className="flex min-h-screen bg-[#000000]">
            {/* Sidebar - Desktop Only (25% width) */}
            <Sidebar />

            {/* Main Content Area - Full width on mobile, 75% on desktop */}
            <div className="flex flex-col min-h-screen w-full lg:ml-[25%]">
                {/* Navbar - Mobile Only */}
                <Navbar />

                <main className="flex-grow pt-16 lg:pt-0 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <Routes>
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
                                path="/certificates"
                                element={
                                    <TransitionWrapper>
                                        <Certificates />
                                    </TransitionWrapper>
                                }
                            />
                        </Routes>
                    </AnimatePresence>
                </main>
                <div className="lg:hidden">
                    <Footer />
                </div>
                <FloatingActionButton />
                <ChatBot />
            </div>
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary
            onError={(error, errorInfo) => {
                // Log error to console in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('App Error Boundary caught an error:', error, errorInfo);
                }
                // In production, you might want to send this to an error reporting service
                // Example: Sentry.captureException(error, { extra: errorInfo });
            }}
        >
            <NetworkErrorBoundary>
                <Router>
                    <ProjectsProvider>
                        <ChatProvider>
                            <GitHubProvider>
                                <Suspense fallback={<Loader />}>
                                    <AppContent />
                                </Suspense>
                            </GitHubProvider>
                        </ChatProvider>
                    </ProjectsProvider>
                </Router>
            </NetworkErrorBoundary>
        </ErrorBoundary>
    );
}

export default App;