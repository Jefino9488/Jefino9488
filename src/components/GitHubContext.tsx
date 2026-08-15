import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  fetchGitHubProfile,
  fetchGitHubStats,
  fetchAllLanguages,
  GitHubProfile,
  GitHubStats,
} from "@/utils/github";

// Cache configuration
const CACHE_KEY = "github_data_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  profile: GitHubProfile | null;
  stats: GitHubStats | null;
  languages: [string, number][];
  timestamp: number;
}

interface CacheLookupResult {
  data: CachedData | null;
  isFresh: boolean;
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
  retry: () => {},
});

// Cache helpers
const getCachedData = (): CacheLookupResult => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return { data: null, isFresh: false };

    const data: CachedData = JSON.parse(cached);
    const isFresh = Date.now() - data.timestamp <= CACHE_TTL;
    return { data, isFresh };
  } catch {
    return { data: null, isFresh: false };
  }
};

const setCachedData = (
  profile: GitHubProfile | null,
  stats: GitHubStats | null,
  languages: [string, number][],
) => {
  try {
    const data: CachedData = {
      profile,
      stats,
      languages,
      timestamp: Date.now(),
    };
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
  const fetchDataRef = useRef<
    ((retryCount?: number, skipCache?: boolean) => Promise<void>) | null
  >(null);

  const fetchData = useCallback(async (retryCount = 0, skipCache = false) => {
    try {
      // Show cached data immediately. If stale, refresh in background.
      if (!skipCache) {
        const cached = getCachedData();
        if (cached.data) {
          setProfile(cached.data.profile);
          setStats(cached.data.stats);
          setLanguages(cached.data.languages);
          setLoading(false);
          // If cache is fresh, don't make network calls
          if (cached.isFresh) {
            return;
          }
        }
      }

      // Execute all API calls concurrently
      const [profileData, statsData, languagesData] = await Promise.allSettled([
        fetchGitHubProfile("Jefino9488"),
        fetchGitHubStats("Jefino9488"),
        fetchAllLanguages("Jefino9488"),
      ]);

      // Track if we got any successful data
      let hasAnyData = false;

      // Handle Profile
      let profileResult: GitHubProfile | null = null;
      if (profileData.status === "fulfilled") {
        profileResult = profileData.value;
        setProfile(profileResult);
        hasAnyData = true;
      }

      // Handle Stats
      let statsResult: GitHubStats | null = null;
      if (statsData.status === "fulfilled") {
        statsResult = statsData.value;
        setStats(statsResult);
        hasAnyData = true;
      }

      // Handle Languages
      let languagesResult: [string, number][] = [];
      if (languagesData.status === "fulfilled") {
        languagesResult = languagesData.value;
        setLanguages(languagesResult);
        hasAnyData = true;
      }

      // If we got some data, update cache and clear errors
      if (hasAnyData) {
        setError(null);
      }

      // Handle failures and retries
      const maxRetries = 2;
      const retryDelay = 1500;

      try {
        // If we got partial data, still update the cache
        if (profileResult || statsResult) {
          setCachedData(profileResult, statsResult, languagesResult);
        }

        // If all failed, throw an error
        if (
          profileData.status === "rejected" &&
          statsData.status === "rejected"
        ) {
          throw new Error("Failed to fetch GitHub data");
        }
      } catch (err) {
        if (retryCount < maxRetries) {
          console.log(
            `GitHub API retry ${retryCount + 1}/${maxRetries} in ${retryDelay}ms`,
          );
          setTimeout(
            () => fetchDataRef.current?.(retryCount + 1, true),
            retryDelay,
          );
          return;
        }
        throw err;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch GitHub data";
      setError(errorMessage);
      console.error("GitHub data fetch failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const retry = useCallback(() => {
    fetchData(0, true); // Skip cache on manual retry
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <GitHubContext.Provider
      value={{ profile, stats, languages, loading, error, retry }}
    >
      {children}
    </GitHubContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGitHubData = () => useContext(GitHubContext);
