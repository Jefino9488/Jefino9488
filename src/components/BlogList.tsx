import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, Search, BookOpen, ArrowRight } from "lucide-react";
import PageHeader from "./PageHeader";
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

    const formatMonthDay = (dateString: string) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
            day: date.toLocaleDateString('en-US', { day: '2-digit' }),
            year: date.toLocaleDateString('en-US', { year: 'numeric' })
        };
    };

    const handleTagClick = (tag: string) => {
        setSelectedTag(currentTag => currentTag === tag ? "" : tag);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-foreground">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg font-medium font-mono text-muted-foreground uppercase tracking-widest">Loading Publications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-foreground relative selection:bg-primary/30">
            <PageHeader 
                title="Publications"
                icon={BookOpen}
                meta={`${posts.length} Entries`}
            />

            <div className="container mx-auto px-4 py-24 sm:py-32 max-w-5xl space-y-12">
                {/* Search & Filter Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white/[0.02] p-4 sm:p-6 rounded-[2rem] border border-white/5"
                >
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#b3bad9]/50" />
                        <input
                            type="text"
                            placeholder="Search publications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-foreground placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Button
                            onClick={() => setSelectedTag("")}
                            variant="ghost"
                            size="sm"
                            className={`rounded-full border text-xs h-9 px-4 font-mono transition-all ${selectedTag === "" ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_-3px_rgba(102,111,188,0.5)]' : 'bg-transparent border-white/10 text-[#b3bad9] hover:bg-white/10'}`}
                        >
                            All
                        </Button>
                        {allTags.map(tag => (
                            <Button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                variant="ghost"
                                size="sm"
                                className={`rounded-full border text-xs h-9 px-4 font-mono uppercase tracking-wider transition-all ${selectedTag === tag ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_-3px_rgba(102,111,188,0.5)]' : 'bg-transparent border-white/10 text-[#b3bad9] hover:bg-white/10 hover:border-white/20'}`}
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content - Minimalist Publication List */}
                <main>
                    {filteredPosts.length > 0 ? (
                        <div className="flex flex-col">
                            {filteredPosts.map((post, index) => {
                                const date = formatMonthDay(post.published_at);
                                const CardWrapper = ({ children }: { children: React.ReactNode }) => (
                                    post.isLocal ? (
                                        <Link to={`/blog/${post.localId}`} className="block group">
                                            {children}
                                        </Link>
                                    ) : (
                                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="block group">
                                            {children}
                                        </a>
                                    )
                                );

                                return (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                    >
                                        <CardWrapper>
                                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 py-8 sm:py-12 border-b border-white/5 relative hover:bg-white/[0.02] transition-colors -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-3xl group-hover:border-primary/20">
                                                
                                                {/* Left Column: Date (Desktop) */}
                                                <div className="hidden md:flex flex-col flex-shrink-0 w-24 pt-2">
                                                    <span className="text-sm font-mono text-[#b3bad9]/60 uppercase tracking-widest">{date.month}</span>
                                                    <span className="text-4xl font-poppins font-light text-white my-1">{date.day}</span>
                                                    <span className="text-xs font-mono text-[#b3bad9]/40">{date.year}</span>
                                                </div>

                                                {/* Middle Column: Content */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Mobile Date */}
                                                    <div className="md:hidden flex items-center gap-3 text-xs font-mono text-[#b3bad9]/60 uppercase tracking-widest mb-3">
                                                        <span>{date.month} {date.day}, {date.year}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.reading_time_minutes} MIN</span>
                                                    </div>

                                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-white mb-4 group-hover:text-primary transition-colors leading-[1.2] tracking-tight pr-8">
                                                        {post.title}
                                                    </h3>
                                                    
                                                    <p className="font-light text-lg text-[#b3bad9] mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                                                        {post.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-3 mt-4">
                                                        {post.tag_list && post.tag_list.slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-[#b3bad9] uppercase tracking-wider border border-white/10">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {/* Desktop Read Time */}
                                                        <div className="hidden md:flex items-center text-xs font-mono text-[#b3bad9]/50 uppercase tracking-widest ml-4">
                                                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                            {post.reading_time_minutes} Min Read
                                                        </div>
                                                        {post.isLocal && (
                                                            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest ml-auto">
                                                                Internal Docs
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Column: Interaction Arrow */}
                                                <div className="hidden md:flex items-center justify-center flex-shrink-0 w-12 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                        <ArrowRight className="w-5 h-5 text-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardWrapper>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-white/5"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Search className="h-8 w-8 text-[#b3bad9]/50" />
                            </div>
                            <h2 className="text-2xl font-poppins font-semibold mb-3 text-white">No Publications Found</h2>
                            <p className="text-[#b3bad9] mb-8 font-light max-w-md mx-auto">We couldn't find any articles matching your search query or selected tags. Try adjusting them.</p>
                            <Button
                                onClick={() => { setSearchTerm(""); setSelectedTag(""); }}
                                className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 font-semibold"
                            >
                                Clear All Filters
                            </Button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}