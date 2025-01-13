import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

import post1 from '@/blogPosts/post1.json'
import post2 from '@/blogPosts/post2.json'

const blogPosts = [post1, post2];

export default function BlogList() {
    return (
        <div className="min-h-screen bg-[#11111b] py-16 px-4 sm:px-6 lg:px-8 text-[#cdd6f4]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-[#cba6f7]">My Blogs</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Thoughts, ideas, and insights on technology, development, and more</p>
                </header>

                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to={`/blog/${post.id}`}>
                                <Card className="bg-[#313244] border-none text-[#cdd6f4] hover:bg-[#45475a] transition-all duration-300 rounded-2xl shadow-lg transform hover:-translate-y-1">
                                    <CardHeader>
                                        <CardTitle className="text-xl sm:text-2xl font-semibold mb-2">{post.title}</CardTitle>
                                        <div className="flex items-center text-sm text-gray-400 mb-2">
                                            <Calendar className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                            <span className="mr-4">{post.date}</span>
                                            <Clock className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-300 mb-4">{post.excerpt}</p>
                                        <div className="flex items-center text-[#cba6f7] hover:text-[#f5c2e7] transition-colors">
                                            <span className="mr-2 font-semibold">Read more</span>
                                            <ArrowRight className="h-4 w-4 text-[#89b4fa]" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </main>
            </div>
            <div className="mt-12 text-center">
                <Link to="/">
                    <Button variant="ghost" className="hover:bg-[#45475a] hover:text-[#cdd6f4] transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}

