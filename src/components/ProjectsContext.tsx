/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  stats: {
    stars: number;
    forks: number;
  };
  link: string;
  updatedAt?: string;
}

const ProjectsContext = createContext<{
  pinnedProjects: Project[];
  allProjects: Project[];
  loading: boolean;
  error: string | null;
}>({
  pinnedProjects: [],
  allProjects: [],
  loading: true,
  error: null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => useContext(ProjectsContext);

const getPinnedProjectsQuery = `
    query {
      user(login: "Jefino9488") {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              url
              updatedAt
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
              primaryLanguage {
                name
              }
              repositoryTopics(first: 3) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
`;

const getAllProjectsQuery = `
    query {
      user(login: "Jefino9488") {
        repositories(first: 28, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            name
            description
            url
            updatedAt
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
            primaryLanguage {
              name
            }
            repositoryTopics(first: 3) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
    }
`;

async function fetchGitHubProjects(query: string): Promise<{ projects: Project[]; error?: string }> {
  const GITHUB_API_URL = 'https://api.github.com/graphql';
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  try {
    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return { projects: [], error: `Failed to fetch repositories: ${response.statusText}` };
    }

    const data = await response.json();

    if (data.errors) {
      return { projects: [], error: data.errors.map((error: any) => error.message).join(', ') };
    }

     
    const items = data.data.user.pinnedItems || data.data.user.repositories;
    const projects: Project[] = items.nodes.map((repo: any) => ({
      title: repo.name.toLowerCase(),
      description: repo.description || '',
      tech: [
        repo.primaryLanguage?.name,
        ...repo.repositoryTopics.nodes.slice(0, 2).map((topic: any) =>
          topic.topic.name.replace(/-/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())
        ),
      ].filter((tech: string) => tech), // Filter out undefined/null values
      stats: { stars: repo.stargazers.totalCount, forks: repo.forks.totalCount },
      link: repo.url,
      updatedAt: repo.updatedAt,
    }));

    return { projects, error: undefined };
  } catch (error) {
    console.error('Error fetching GitHub repos:', error instanceof Error ? error.message : String(error));
    return { projects: [], error: 'Failed to load projects' };
  }
}

const PROJECTS_CACHE_KEY = 'portfolio_projects_cache';
const PROJECTS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

interface ProjectsCache {
  pinnedProjects: Project[];
  allProjects: Project[];
  timestamp: number;
}

function getProjectsCache(): ProjectsCache | null {
  try {
    const raw = localStorage.getItem(PROJECTS_CACHE_KEY);
    if (!raw) return null;
    const cache: ProjectsCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > PROJECTS_CACHE_TTL) {
      localStorage.removeItem(PROJECTS_CACHE_KEY);
      return null;
    }
    return cache;
  } catch {
    return null;
  }
}

function setProjectsCache(pinnedProjects: Project[], allProjects: Project[]) {
  try {
    const cache: ProjectsCache = { pinnedProjects, allProjects, timestamp: Date.now() };
    localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(cache));
  } catch { /* Ignore storage quota errors */ }
}

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  const fetchProjects = useCallback(async () => {
    // Check cache first — avoids 2 GraphQL round-trips on repeat visits
    const cached = getProjectsCache();
    if (cached) {
      setPinnedProjects(cached.pinnedProjects);
      setAllProjects(cached.allProjects);
      setLoading(false);
      fetched.current = true;
      return;
    }

    try {
      const [pinnedResult, allResult] = await Promise.allSettled([
        fetchGitHubProjects(getPinnedProjectsQuery),
        fetchGitHubProjects(getAllProjectsQuery),
      ]);

      let pinnedData: Project[] = [];
      let allData: Project[] = [];

      if (pinnedResult.status === 'fulfilled') {
        const { projects, error: pinnedError } = pinnedResult.value;
        if (pinnedError) setError(pinnedError);
        else pinnedData = projects;
      }

      if (allResult.status === 'fulfilled') {
        const { projects, error: allError } = allResult.value;
        if (allError) setError(allError);
        else allData = projects;
      }

      setPinnedProjects(pinnedData);
      setAllProjects(allData);

      // Cache successful responses
      if (pinnedData.length > 0 || allData.length > 0) {
        setProjectsCache(pinnedData, allData);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
      fetched.current = true;
    }
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectsContext.Provider value={{ pinnedProjects, allProjects, loading, error }}>
      {children}
    </ProjectsContext.Provider>
  );
};