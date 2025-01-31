import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com/users';

export interface GitHubProfile {
    login: string;
    avatar_url: string;
    name: string;
    public_repos: number;
    followers: number;
    following: number;
}

interface GitHubRepo {
    stargazers_count: number;
    commits_url: string;
    language: string;
}

export interface GitHubStats {
    totalStars: number;
    totalCommits: number;
    topLanguages: [string, number][];
    totalPullRequests: number; // Add total pull requests
}
export const fetchTotalPullRequests = async (username: string): Promise<number | null> => {
    try {
        const response = await axios.get(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
        return response.data.total_count; // Total number of pull requests
    } catch (error) {
        console.error('Error fetching total pull requests:', error);
        return null;
    }
};


export const fetchGitHubProfile = async (username: string): Promise<GitHubProfile | null> => {
    try {
        const response = await axios.get<GitHubProfile>(`${GITHUB_API_URL}/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        return null;
    }
};

export const fetchGitHubStats = async (username: string): Promise<GitHubStats | null> => {
    try {
        const response = await axios.get<GitHubRepo[]>(`${GITHUB_API_URL}/${username}/repos`);
        const repos = response.data;

        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalCommits = repos.reduce((acc, repo) => acc + (repo.commits_url ? repo.commits_url.length : 0), 0);
        const topLanguages = repos.reduce((acc, repo) => {
            if (repo.language) {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const totalPullRequests = await fetchTotalPullRequests(username); // Fetch total pull requests

        return {
            totalStars,
            totalCommits,
            topLanguages: Object.entries(topLanguages).sort((a, b) => b[1] - a[1]).slice(0, 5),
            totalPullRequests: totalPullRequests || 0, // Add total pull requests
        };
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        return null;
    }
};