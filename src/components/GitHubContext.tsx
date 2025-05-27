import { createContext, useContext, useEffect, useState } from "react";
import { fetchGitHubProfile, fetchGitHubStats, GitHubProfile, GitHubStats } from "@/utils/github";

interface GitHubContextType {
    profile: GitHubProfile | null;
    stats: GitHubStats | null;
    loading: boolean;
}

const GitHubContext = createContext<GitHubContextType>({
    profile: null,
    stats: null,
    loading: true,
});

export const GitHubProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const p = await fetchGitHubProfile("Jefino9488");
            const s = await fetchGitHubStats("Jefino9488");
            setProfile(p);
            setStats(s);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <GitHubContext.Provider value={{ profile, stats, loading }}>
            {children}
        </GitHubContext.Provider>
    );
};

export const useGitHubData = () => useContext(GitHubContext);
