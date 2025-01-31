import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface Project {
    title: string;
    description: string;
    tech: string[];
    stats: {
        stars: number;
        forks: number;
    };
    link: string;
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
        repositories(first: 15, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            name
            description
            url
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

        let repositories: any[] = [];
        if (query.includes("pinnedItems")) {
            repositories = data.data.user.pinnedItems.nodes;
        } else if (query.includes("repositories")) {
            repositories = data.data.user.repositories.nodes;
        }

        // Map repositories to Project objects
        const projects = repositories.map((repo: any) => ({
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
        }));

        return { projects, error: undefined };
    } catch (error) {
        console.error('Error fetching GitHub repos:', error instanceof Error ? error.message : String(error));
        return { projects: [], error: 'Failed to load projects' };
    }
}

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
    const [pinnedProjects, setPinnedProjects] = useState<Project[]>([]);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;

        fetchGitHubProjects(getPinnedProjectsQuery)
            .then(({ projects: pinned, error: pinnedError }) => {
                if (pinnedError) {
                    setError(pinnedError);
                } else {
                    setPinnedProjects(pinned);
                }
            });

        fetchGitHubProjects(getAllProjectsQuery)
            .then(({ projects: all, error: allError }) => {
                if (allError) {
                    setError(allError);
                } else {
                    setAllProjects(all);
                }
                setLoading(false);
                fetched.current = true;
            })
            .catch((err) => {
                console.error('Error fetching all projects:', err);
                setError('Failed to fetch all projects');
                setLoading(false);
                fetched.current = true;
            });
    }, []);

    return (
        <ProjectsContext.Provider value={{ pinnedProjects, allProjects, loading, error }}>
            {children}
        </ProjectsContext.Provider>
    );
};