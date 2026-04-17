import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, GitCommit, GitFork, Users, GitPullRequest, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { useGitHubData } from "@/components/GitHubContext"; // Import your context


export default function GitHubDashboard() {
    const { profile, stats, loading } = useGitHubData();

    if (loading || !profile || !stats) {
        return (
            <div className="flex justify-center items-center h-48 bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/5 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary drop-shadow-[0_0_15px_rgba(102,111,188,0.8)] z-10"></div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <Card className="glass-crystal w-full border-0 rounded-3xl overflow-hidden relative shadow-[0_0_40px_-15px_rgba(102,111,188,0.2)] bg-[#0a0a0a]/60">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#8ab8d0]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <CardHeader className="pt-6 pb-2 px-6 sm:px-8 border-b border-white/5 relative z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold font-poppins text-white flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                                <GitBranch className="h-5 w-5 text-primary" />
                            </div>
                            GitHub Matrix
                        </CardTitle>
                        <p className="text-xs font-mono text-[#b3bad9]/60 uppercase tracking-widest mt-2 ml-12">
                            Live Telemetry // @{profile.login}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { icon: Star, label: "STARS", value: stats.totalStars, color: "text-amber-400" },
                            { icon: GitCommit, label: "COMMITS", value: stats.totalCommits, color: "text-primary" },
                            { icon: GitFork, label: "REPOS", value: profile.public_repos, color: "text-[#8ab8d0]" },
                            { icon: Users, label: "FOLLOWERS", value: profile.followers, color: "text-emerald-400" },
                            { icon: Users, label: "FOLLOWING", value: profile.following, color: "text-[#b3bad9]" },
                            { icon: GitPullRequest, label: "PRs", value: stats.totalPullRequests, color: "text-purple-400" },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group flex flex-col justify-center items-center py-5 px-2 bg-[#0a0a0a]/60 border border-white/5 border-l-2 border-l-primary/40 rounded-xl hover:bg-[#1a1a2e]/60 hover:border-l-primary transition-all duration-500 relative overflow-hidden shadow-md"
                            >
                                {/* Terminal Scanline Hover */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-y-[-100%] group-hover:translate-y-0" />
                                
                                <item.icon className={`relative z-10 h-6 w-6 mb-3 ${item.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_currentColor] group-hover:scale-110 transition-all duration-500`} />
                                <span className="relative z-10 text-xl sm:text-2xl font-mono tracking-tight text-white mb-1 group-hover:text-primary transition-colors">
                                    {item.value}
                                </span>
                                <span className="relative z-10 text-[10px] font-mono tracking-widest text-[#b3bad9] group-hover:text-white transition-colors">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
}
