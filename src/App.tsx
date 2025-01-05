import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import About from './components/About';
import Projects from './components/Projects';
import Loader from './components/Loader';
import TransitionWrapper from './components/TransitionWrapper';
import { ProjectsProvider } from './components/ProjectsContext';

function AppContent() {
    return (
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
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ProjectsProvider>
                <Suspense fallback={<Loader />}>
                    <AppContent />
                </Suspense>
            </ProjectsProvider>
        </Router>
    );
}

export default App;
