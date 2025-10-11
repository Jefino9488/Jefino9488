import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchGitHubProfile, fetchGitHubStats, GitHubProfile, GitHubStats } from "@/utils/github";

interface GitHubContextType {
    profile: GitHubProfile | null;
    stats: GitHubStats | null;
    loading: boolean;
    error: string | null;
    retry: () => void;
}

const GitHubContext = createContext<GitHubContextType>({
    profile: null,
    stats: null,
    loading: true,
    error: null,
    retry: () => {},
});

export const GitHubProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (retryCount = 0) => {
        try {
            setLoading(true);
            setError(null);

            const maxRetries = 3;
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);

            try {
                const [profileData, statsData] = await Promise.allSettled([
                    fetchGitHubProfile("Jefino9488"),
                    fetchGitHubStats("Jefino9488")
                ]);

                if (profileData.status === 'fulfilled') {
                    setProfile(profileData.value);
                } else {
                    console.error('Failed to fetch GitHub profile:', profileData.reason);
                }

                if (statsData.status === 'fulfilled') {
                    setStats(statsData.value);
                } else {
                    console.error('Failed to fetch GitHub stats:', statsData.reason);
                }

                // If both failed, throw an error
                if (profileData.status === 'rejected' && statsData.status === 'rejected') {
                    throw new Error('Failed to fetch GitHub data');
                }

            } catch (err) {
                if (retryCount < maxRetries) {
                    console.log(`GitHub API retry ${retryCount + 1}/${maxRetries} in ${retryDelay}ms`);
                    setTimeout(() => fetchData(retryCount + 1), retryDelay);
                    return;
                }
                throw err;
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub data';
            setError(errorMessage);
            console.error('GitHub data fetch failed:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const retry = useCallback(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <GitHubContext.Provider value={{ profile, stats, loading, error, retry }}>
            {children}
        </GitHubContext.Provider>
    );
};

export const useGitHubData = () => useContext(GitHubContext);
