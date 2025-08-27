import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import About from "./components/About";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TransitionWrapper from "./components/TransitionWrapper";
import { ProjectsProvider } from "./components/ProjectsContext";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import FloatingActionButton from "@/components/ChatBot/FloatingActionButton.tsx";
import ChatBot from "@/components/ChatBot/ChatBot.tsx";
import { ChatProvider } from "@/components/ChatBot/ChatContext.tsx";
import { GitHubProvider } from "@/components/GitHubContext.tsx";

function AppContent() {
    useSmoothScroll();

    return (
        <div className="flex flex-col min-h-screen bg-[#000000]">
            <Navbar />
            <main className="flex-grow pt-16">
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
                            path="/privacy-policy"
                            element={
                                <TransitionWrapper>
                                    <PrivacyPolicy />
                                </TransitionWrapper>
                            }
                        />
                        <Route
                            path="/terms-of-service"
                            element={
                                <TransitionWrapper>
                                    <TermsOfService />
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
            <Footer />
            <FloatingActionButton />
            <ChatBot />
        </div>
    );
}

function App() {
    return (
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
    );
}

export default App;