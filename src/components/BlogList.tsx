import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Loader2, Search, BookOpen } from "lucide-react";
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
        posts.forEach(post => post.tag_list?.forEach((tag: string) => tags.add(tag)));
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center text-foreground">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg font-medium">Loading articles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-foreground">
            {/* Header Section - Compact & Sticky */}
            <section className="w-full py-4 sm:py-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10 hover:text-primary transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Tech Journal
                        </h1>
                    </div>

                    <div className="hidden sm:flex text-xs sm:text-sm text-muted-foreground font-medium px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        {posts.length} Articles
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
                {/* Search & Filter Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
                        <Button
                            onClick={() => setSelectedTag("")}
                            variant="ghost"
                            size="sm"
                            className={`rounded-full border text-xs h-8 px-3 ${selectedTag === "" ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-transparent border-white/5 text-muted-foreground hover:bg-white/5'}`}
                        >
                            All
                        </Button>
                        {allTags.map(tag => (
                            <Button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                variant="ghost"
                                size="sm"
                                className={`rounded-full border text-xs h-8 px-3 ${selectedTag === tag ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-transparent border-white/5 text-muted-foreground hover:bg-white/5'}`}
                            >
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <main>
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredPosts.map((post, index) => {
                                const CardWrapper = ({ children }: { children: React.ReactNode }) => (
                                    post.isLocal ? (
                                        <Link to={`/blog/${post.localId}`} className="block h-full">
                                            {children}
                                        </Link>
                                    ) : (
                                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                                            {children}
                                        </a>
                                    )
                                );

                                return (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="h-full"
                                    >
                                        <CardWrapper>
                                            <Card className="glass-crystal border-0 text-card-foreground rounded-[1.5rem] shadow-sm overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer group hover:shadow-xl hover:-translate-y-1 hover:bg-white/[0.03]">
                                                {post.cover_image && (
                                                    <div className="overflow-hidden relative h-48 sm:h-52">
                                                        <img
                                                            src={post.cover_image}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        {post.isLocal && (
                                                            <div className="absolute top-3 right-3">
                                                                <Badge className="bg-background/80 backdrop-blur-md text-foreground border border-white/10 text-[10px] font-semibold">
                                                                    Docs
                                                                </Badge>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                                    </div>
                                                )}
                                                {!post.cover_image && post.isLocal && (
                                                    <div className="p-4 pt-4 absolute top-0 right-0">
                                                        <Badge className="bg-primary/20 text-primary border border-primary/20 text-[10px]">
                                                            Documentation
                                                        </Badge>
                                                    </div>
                                                )}

                                                <CardHeader className="p-5 pb-2">
                                                    <CardTitle className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                        {post.title}
                                                    </CardTitle>
                                                </CardHeader>

                                                <CardContent className="p-5 pt-0 flex-grow flex flex-col">
                                                    <p className="text-muted-foreground/80 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                                                        {post.description}
                                                    </p>

                                                    {post.tag_list && post.tag_list.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                                            {post.tag_list.slice(0, 3).map((tag: string) => (
                                                                <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[10px] text-muted-foreground font-medium">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5 text-xs text-muted-foreground/60 font-medium">
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                                            <span>{formatDate(post.published_at)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                                                            <span>{post.reading_time_minutes} min read</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CardWrapper>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/5 mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2 text-foreground">No Articles Found</h2>
                            <p className="text-muted-foreground mb-6">Try adjusting your search or selecting a different topic.</p>
                            <Button
                                onClick={() => { setSearchTerm(""); setSelectedTag(""); }}
                                variant="outline"
                                className="border-white/10 hover:bg-white/5"
                            >
                                Clear Filters
                            </Button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}