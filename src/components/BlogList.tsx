import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Loader2, Search, Filter } from "lucide-react";
import { getBlogPosts, type BlogPost } from "@/services/blogService"; // Assuming your service file is set up

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const fetchedPosts = await getBlogPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Memoize the calculation of unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        // The dev.to API returns 'tag_list' which is an array of strings
        posts.forEach(post => post.tag_list?.forEach((tag: string) => tags.add(tag)));
        return Array.from(tags).sort();
    }, [posts]);

    // Memoize the filtering logic
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = searchTerm
                ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(searchTerm.toLowerCase())
                : true;

            const matchesTag = selectedTag
                ? post.tag_list?.includes(selectedTag)
                : true;

            return matchesSearch && matchesTag;
        });
    }, [posts, searchTerm, selectedTag]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedTag("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020203] flex items-center justify-center">
                <div className="text-center text-[#cdd6f4]">
                    <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-[#cba6f7]" />
                    <p className="text-lg font-medium">Loading articles...</p>
                    <p className="text-sm text-gray-400 mt-2">Fetching the latest content for you</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020203] text-[#cdd6f4]">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#020203] via-[#0C0810] to-[#020203] border-b border-[#313244]/30">
                <div className="container mx-auto px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text text-transparent">
                            Jefino's Tech Journal
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
                            A collection of articles on full-stack development, AI, and modern web technologies.
                        </p>

                        {/* Search and Filter Section */}
                        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#0C0810] border border-[#313244] rounded-xl text-[#cdd6f4] placeholder-gray-400 focus:border-[#cba6f7] focus:outline-none focus:ring-2 focus:ring-[#cba6f7]/20 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full sm:w-auto pl-12 pr-8 py-3 bg-[#0C0810] border border-[#313244] rounded-xl text-[#cdd6f4] focus:border-[#cba6f7] focus:outline-none focus:ring-2 focus:ring-[#cba6f7]/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">All Topics</option>
                                    {allTags.map(tag => (
                                        <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-16">
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                                    <Card className="group relative bg-[#0C0810] border-[#313244] text-[#cdd6f4] hover:border-[#cba6f7]/50 transition-all duration-300 rounded-2xl shadow-lg transform hover:-translate-y-1 h-full flex flex-col overflow-hidden">
                                        {post.cover_image && (
                                            <div className="overflow-hidden">
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-xl font-semibold mb-2 text-[#f5c2e7] group-hover:text-[#cba6f7] transition-colors">{post.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow flex flex-col">
                                            <p className="text-gray-300 mb-4 flex-grow">{post.description}</p>
                                            <div className="flex items-center text-sm text-gray-400 mt-auto pt-4 border-t border-[#313244]/50">
                                                <Calendar className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                                <span className="mr-4">{formatDate(post.published_at)}</span>
                                                <Clock className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                                <span>{post.reading_time_minutes} min read</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-12">
                        <h2 className="text-2xl font-semibold mb-2">No Articles Found</h2>
                        <p>Try adjusting your search or filters.</p>
                        <Button onClick={clearFilters} variant="link" className="text-[#89b4fa] mt-4">
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>

            {/* Back to Home Section */}
            <div className="border-t border-[#313244]/30">
                <div className="container mx-auto px-6 py-12 text-center">
                    <Link to="/">
                        <Button variant="ghost" className="hover:bg-[#45475a] hover:text-[#cdd6f4] transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}