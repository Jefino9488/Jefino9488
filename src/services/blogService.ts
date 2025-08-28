// src/services/blogService.ts

// Define a type for the blog post data we expect from the API
export interface BlogPost {
    tag_list: string;
    id: number;
    title: string;
    description: string;
    published_at: string;
    reading_time_minutes: number;
    url: string;
    cover_image: string | null; // The main image of the post
    user: {
        name: string;
    };
}

// Your dev.to username
const USERNAME = 'jefino9488';
const API_URL = `https://dev.to/api/articles?username=${USERNAME}`;

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
        }
        const data: BlogPost[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching blog posts from dev.to:", error);
        // Return an empty array so the site doesn't crash
        return [];
    }
};