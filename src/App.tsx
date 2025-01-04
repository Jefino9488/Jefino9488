import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import About from './components/About';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { ProjectsProvider } from './components/ProjectsContext';

function AppContent() {
    useSmoothScroll();

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/blog" element={<BlogList/>}/>
            <Route path="/blog/:id" element={<BlogPost/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/terms-of-service" element={<TermsOfService/>}/>
            <Route path="/about" element={<About/>}/>
        </Routes>
    );
}
function App() {
    return (
        <Router>
            <ProjectsProvider>
                <AppContent />
            </ProjectsProvider>
        </Router>
    );
}

export default App;

