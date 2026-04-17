import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export interface GitHubProfile {
    login: string;
    avatar_url: string;
    name: string;
    public_repos: number;
    followers: number;
    following: number;
    bio: string | null;
    location: string | null;
    created_at: string;
    company: string | null;
    blog: string | null;
    twitter_username: string | null;
}

interface GitHubRepo {
    name: string;
    stargazers_count: number;
    language: string;
    pushed_at?: string;
}

export interface GitHubStats {
    totalStars: number;
    totalCommits: number;
    topLanguages: [string, number][];
    totalPullRequests: number;
}

const axiosInstance = axios.create({
    headers: {
        ...(GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {}),
        'Accept': 'application/vnd.github.v3+json'
    }
});

const REPOS_CACHE_TTL = 10 * 60 * 1000;
const COMMIT_SCAN_LIMIT = 12;
const COMMIT_SCAN_CONCURRENCY = 4;

let reposCache: { username: string; timestamp: number; repos: GitHubRepo[] } | null = null;

const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
    if (
        reposCache &&
        reposCache.username === username &&
        Date.now() - reposCache.timestamp < REPOS_CACHE_TTL
    ) {
        return reposCache.repos;
    }

    const reposResponse = await axiosInstance.get<GitHubRepo[]>(`${GITHUB_API_URL}/${username}/repos?per_page=100`);
    reposCache = {
        username,
        timestamp: Date.now(),
        repos: reposResponse.data,
    };

    return reposResponse.data;
};

const mapWithConcurrency = async <T, R>(
    items: T[],
    limit: number,
    mapper: (item: T) => Promise<R>
): Promise<R[]> => {
    const results: R[] = [];
    let index = 0;

    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (index < items.length) {
            const current = index;
            index += 1;
            results[current] = await mapper(items[current]);
        }
    });

    await Promise.all(workers);
    return results;
};

export const fetchTotalPullRequests = async (username: string): Promise<number> => {
    try {
        const response = await axiosInstance.get(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
        return response.data.total_count;
    } catch (error) {
        console.error('Error fetching total pull requests:', error);
        return 0;
    }
};

export const fetchGitHubProfile = async (username: string): Promise<GitHubProfile | null> => {
    try {
        const response = await axiosInstance.get<GitHubProfile>(`${GITHUB_API_URL}/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        return null;
    }
};

const fetchCommitCountForRepo = async (username: string, repoName: string): Promise<number> => {
    try {
        const response = await axiosInstance.get(
            `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`
        );

        const link = response.headers.link;
        if (link) {
            const match = link.match(/&page=(\d+)>; rel="last"/);
            return match ? parseInt(match[1], 10) : 1;
        }

        return response.data.length || 1;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.warn(`Failed to fetch commits for ${repoName}:`, error.message);
        return 0;
    }
};

export const fetchGitHubStats = async (username: string): Promise<GitHubStats | null> => {
    try {
        const repos = await fetchUserRepos(username);

        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        // Sample recently pushed repositories to reduce API fan-out while preserving a useful estimate.
        const reposByActivity = [...repos]
            .sort((a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime());
        const reposForCommitScan = reposByActivity.slice(0, COMMIT_SCAN_LIMIT);

        let totalCommits = 0;
        if (reposForCommitScan.length > 0) {
            const commitCounts = await mapWithConcurrency(
                reposForCommitScan,
                COMMIT_SCAN_CONCURRENCY,
                (repo) => fetchCommitCountForRepo(username, repo.name)
            );
            const sampledTotal = commitCounts.reduce((sum, count) => sum + count, 0);
            const scalingFactor = repos.length / reposForCommitScan.length;
            totalCommits = Math.round(sampledTotal * scalingFactor);
        }

        const languageMap = repos.reduce((acc, repo) => {
            if (repo.language) {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const totalPullRequests = await fetchTotalPullRequests(username);

        return {
            totalStars,
            totalCommits,
            topLanguages: Object.entries(languageMap).sort((a, b) => b[1] - a[1]).slice(0, 5),
            totalPullRequests
        };
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        return null;
    }
};

// Calculate experience years from GitHub account creation date
export const calculateExperienceYears = (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const years = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(years);
};

// Categorize languages into frontend, backend, and tools
export const categorizeSkills = (languages: [string, number][]): {
    frontend: string[];
    backend: string[];
    tools: string[]
} => {
    const frontendLangs = ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Vue', 'Svelte'];
    const backendLangs = ['Python', 'Java', 'Kotlin', 'Go', 'Rust', 'C', 'C++', 'C#', 'Ruby', 'PHP'];
    const toolsLangs = ['Shell', 'Dockerfile', 'Makefile', 'Smali', 'Batchfile', 'PowerShell'];

    const frontend: string[] = [];
    const backend: string[] = [];
    const tools: string[] = [];

    languages.forEach(([lang]) => {
        if (frontendLangs.includes(lang)) frontend.push(lang);
        else if (backendLangs.includes(lang)) backend.push(lang);
        else if (toolsLangs.includes(lang)) tools.push(lang);
    });

    // Add common frameworks/tools based on languages found
    if (frontend.includes('TypeScript') || frontend.includes('JavaScript')) {
        if (!frontend.includes('React')) frontend.push('React');
        if (!frontend.includes('Tailwind CSS')) frontend.push('Tailwind CSS');
    }
    if (backend.includes('Python')) {
        if (!backend.includes('Flask')) backend.push('Flask');
    }
    if (backend.includes('Java') || backend.includes('Kotlin')) {
        if (!backend.includes('Android SDK')) backend.push('Android SDK');
    }
    if (tools.includes('Shell')) {
        if (!tools.includes('Git')) tools.push('Git');
        if (!tools.includes('Docker')) tools.push('Docker');
    }

    return { frontend, backend, tools };
};

// Fetch all languages from repos (with counts)
export const fetchAllLanguages = async (username: string): Promise<[string, number][]> => {
    try {
        const repos = await fetchUserRepos(username);

        const languageMap = repos.reduce((acc, repo) => {
            if (repo.language) {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(languageMap).sort((a, b) => b[1] - a[1]);
    } catch (error) {
        console.error('Error fetching languages:', error);
        return [];
    }
};
