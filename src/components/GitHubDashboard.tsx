import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, GitCommit, GitFork, Users, GitPullRequest } from "lucide-react";
import { motion } from "framer-motion";
import { useGitHubData } from "@/components/GitHubContext"; // Import your context


export default function GitHubDashboard() {
    const { profile, stats, loading } = useGitHubData();

    if (loading || !profile || !stats) {
        return (
            <div className="flex justify-center items-center h-48 bg-card rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden w-full">
            <CardHeader className="py-4 px-4 border-b border-border">
                <div className="flex flex-col items-center">

                    <CardTitle className="flex items-center justify-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Github Overview</h1>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {[
                            { icon: Star, label: "Stars", value: stats.totalStars },
                            { icon: GitCommit, label: "Commits", value: stats.totalCommits },
                            { icon: GitFork, label: "Repos", value: profile.public_repos },
                            { icon: Users, label: "Followers", value: profile.followers },
                            { icon: Users, label: "Following", value: profile.following },
                            { icon: GitPullRequest, label: "PRs", value: stats.totalPullRequests },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex flex-col items-center p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-all duration-300"
                            >
                                <item.icon className="h-6 w-6 text-primary mb-2" />
                                <span className="text-base font-bold text-foreground">{item.value}</span>
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
}
