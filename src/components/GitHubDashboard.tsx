import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchGitHubProfile, fetchGitHubStats, type GitHubProfile, type GitHubStats } from "@/utils/github"
import { Star, GitCommit, GitFork, Users, GitPullRequest } from "lucide-react"
import { motion } from "framer-motion"

interface GitHubDashboardProps {
    username: string
}

export default function GitHubDashboard({ username }: GitHubDashboardProps) {
    const [profile, setProfile] = useState<GitHubProfile | null>(null)
    const [stats, setStats] = useState<GitHubStats | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const profileData = await fetchGitHubProfile(username)
            const statsData = await fetchGitHubStats(username)
            setProfile(profileData)
            setStats(statsData)
        }

        fetchData()
    }, [username])

    if (!profile || !stats) {
        return (
            <div className="flex justify-center items-center h-48 bg-[#11111b] rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5c2e7]"></div>
            </div>
        )
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
    }

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    }

    return (
        <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
            <CardHeader className="bg-[#1e1e2e] py-4 px-4">
                <CardTitle className="flex flex-col items-center text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#cba6f7]">Github Overview</h1>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {/* GitHub Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { icon: Star, label: "Stars", value: stats.totalStars },
                            { icon: GitCommit, label: "Commits", value: stats.totalCommits },
                            { icon: GitFork, label: "Repos", value: profile.public_repos },
                            { icon: Users, label: "Followers", value: profile.followers },
                            { icon: Users, label: "Following", value: profile.following },
                            { icon: GitPullRequest, label: "Pull Requests", value: stats.totalPullRequests }, // Replace streak with pull requests
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex flex-col items-center p-2 bg-[#313244] rounded-xl hover:bg-[#313244] transition-colors"
                            >
                                <item.icon className="h-5 w-5 text-[#cba6f7] mb-1" />
                                <span className="text-sm font-bold text-[#f5c2e7]">{item.value}</span>
                                <span className="text-xs text-[#cdd6f4]">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    )
}

