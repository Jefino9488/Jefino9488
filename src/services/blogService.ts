// src/services/blogService.ts

// Define a type for the blog post data we expect from the API and local posts
export interface BlogPost {
    tag_list: string[];
    id: number | string;
    title: string;
    description: string;
    published_at: string;
    reading_time_minutes: number;
    url: string;
    cover_image: string | null;
    user: {
        name: string;
    };
    isLocal?: boolean; // Flag to identify local documentation posts
    localId?: number; // ID for local routing
}

// Your dev.to username
const USERNAME = 'jefino9488';
const API_URL = `https://dev.to/api/articles?username=${USERNAME}`;

// Import local documentation posts
import post3 from '@/blogPosts/post3.json';
import post4 from '@/blogPosts/post4.json';

// Convert local post format to BlogPost format
const convertLocalPost = (post: any): BlogPost => ({
    id: `local-${post.id}`,
    title: post.title,
    description: post.excerpt,
    published_at: post.date,
    reading_time_minutes: parseInt(post.readTime) || 5,
    url: `/blog/${post.id}`,
    cover_image: post.coverImage || null,
    tag_list: ['documentation', 'project'],
    user: {
        name: 'Jefino Jacob'
    },
    isLocal: true,
    localId: post.id
});

// Local documentation posts
const localPosts: BlogPost[] = [
    convertLocalPost(post3),
    convertLocalPost(post4)
];

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
        }
        const devToPosts: BlogPost[] = await response.json();

        // Combine local documentation posts with dev.to posts
        // Local posts appear first (documentation section)
        return [...localPosts, ...devToPosts];
    } catch (error) {
        console.error("Error fetching blog posts from dev.to:", error);
        // Return only local posts if API fails
        return localPosts;
    }
};