import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Loader2, Search } from "lucide-react";
import { getBlogPosts, type BlogPost } from "@/services/blogService";

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

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach(post => post.tag_list?.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, [posts]);

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

    const handleTagClick = (tag: string) => {
        setSelectedTag(currentTag => currentTag === tag ? "" : tag);
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
            <div className="container mx-auto px-4 py-16">
                {/* Redesigned Header */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row justify-between md:items-center gap-8"
                    >
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] bg-clip-text text-transparent">
                                Tech Journal
                            </h1>
                            <p className="text-lg text-gray-400">
                                A collection of my thoughts and development articles.
                            </p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#0C0810] border border-[#313244] rounded-lg text-[#cdd6f4] placeholder-gray-500 focus:border-[#cba6f7] focus:outline-none focus:ring-1 focus:ring-[#cba6f7]/50 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Tag Filters */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-wrap gap-2 mt-8 border-t border-[#313244] pt-6"
                    >
                        <Button
                            onClick={() => setSelectedTag("")}
                            variant="ghost"
                            className={`px-3 py-1 h-auto text-sm rounded-full transition-colors ${selectedTag === "" ? 'bg-[#cba6f7] text-[#11111b]' : 'bg-[#1e1e2e] hover:bg-[#313244]'}`}
                        >
                            All Topics
                        </Button>
                        {allTags.map(tag => (
                            <Button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                variant="ghost"
                                className={`px-3 py-1 h-auto text-sm rounded-full transition-colors ${selectedTag === tag ? 'bg-[#cba6f7] text-[#11111b]' : 'bg-[#1e1e2e] hover:bg-[#313244]'}`}
                            >
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </Button>
                        ))}
                    </motion.div>
                </header>

                {/* Main Content */}
                <main>
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
                                            <CardContent className="flex-grow flex flex-col pt-0">
                                                <p className="text-gray-300 mb-4 flex-grow">{post.description}</p>
                                                {post.tag_list && post.tag_list.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tag_list.slice(0, 3).map(tag => (
                                                            <Badge key={tag} className="bg-[#313244] text-xs font-medium text-[#cdd6f4] border-none">
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-400 py-20"
                        >
                            <h2 className="text-2xl font-semibold mb-2">No Articles Found</h2>
                            <p>Try adjusting your search or selecting a different topic.</p>
                            <Button onClick={() => { setSearchTerm(""); setSelectedTag(""); }} variant="link" className="text-[#89b4fa] mt-4">
                                Clear Filters
                            </Button>
                        </motion.div>
                    )}
                </main>

                <div className="mt-16 text-center">
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