import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchGitHubProfile, fetchGitHubStats, fetchAllLanguages, GitHubProfile, GitHubStats } from "@/utils/github";

// Cache configuration
const CACHE_KEY = 'github_data_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
    profile: GitHubProfile | null;
    stats: GitHubStats | null;
    languages: [string, number][];
    timestamp: number;
}

interface GitHubContextType {
    profile: GitHubProfile | null;
    stats: GitHubStats | null;
    languages: [string, number][];
    loading: boolean;
    error: string | null;
    retry: () => void;
}

const GitHubContext = createContext<GitHubContextType>({
    profile: null,
    stats: null,
    languages: [],
    loading: true,
    error: null,
    retry: () => { },
});

// Cache helpers
const getCachedData = (): CachedData | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CachedData = JSON.parse(cached);
        if (Date.now() - data.timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const setCachedData = (profile: GitHubProfile | null, stats: GitHubStats | null, languages: [string, number][]) => {
    try {
        const data: CachedData = { profile, stats, languages, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        // Ignore storage errors
    }
};

export const GitHubProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [languages, setLanguages] = useState<[string, number][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (retryCount = 0, skipCache = false) => {
        try {
            // Check cache first
            if (!skipCache) {
                const cached = getCachedData();
                if (cached) {
                    setProfile(cached.profile);
                    setStats(cached.stats);
                    setLanguages(cached.languages);
                    setLoading(false);
                    return;
                }
            }

            setLoading(true);
            setError(null);

            const maxRetries = 3;
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);

            try {
                const [profileData, statsData, languagesData] = await Promise.allSettled([
                    fetchGitHubProfile("Jefino9488"),
                    fetchGitHubStats("Jefino9488"),
                    fetchAllLanguages("Jefino9488")
                ]);

                const profileResult = profileData.status === 'fulfilled' ? profileData.value : null;
                const statsResult = statsData.status === 'fulfilled' ? statsData.value : null;
                const languagesResult = languagesData.status === 'fulfilled' ? languagesData.value : [];

                if (profileData.status === 'rejected') {
                    console.error('Failed to fetch GitHub profile:', profileData.reason);
                }
                if (statsData.status === 'rejected') {
                    console.error('Failed to fetch GitHub stats:', statsData.reason);
                }

                setProfile(profileResult);
                setStats(statsResult);
                setLanguages(languagesResult);

                // Cache successful data
                if (profileResult || statsResult) {
                    setCachedData(profileResult, statsResult, languagesResult);
                }

                // If all failed, throw an error
                if (profileData.status === 'rejected' && statsData.status === 'rejected') {
                    throw new Error('Failed to fetch GitHub data');
                }

            } catch (err) {
                if (retryCount < maxRetries) {
                    console.log(`GitHub API retry ${retryCount + 1}/${maxRetries} in ${retryDelay}ms`);
                    setTimeout(() => fetchData(retryCount + 1, true), retryDelay);
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
        fetchData(0, true); // Skip cache on manual retry
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <GitHubContext.Provider value={{ profile, stats, languages, loading, error, retry }}>
            {children}
        </GitHubContext.Provider>
    );
};

export const useGitHubData = () => useContext(GitHubContext);
