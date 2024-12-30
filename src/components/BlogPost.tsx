import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

const blogPosts = [
    {
        id: 1,
        title: "Getting Started with FrameworkPatcher",
        content: {
            introduction: "FrameworkPatcher is an advanced tool designed to help users modify MIUI and Hyper frameworks, specifically for Xiaomi devices running A14 to A15.",
            sections: [
                {
                    title: "Why FrameworkPatcher?",
                    content: [
                        "Customizing system frameworks can be complex and prone to errors. FrameworkPatcher bridges the gap, providing a user-friendly interface and automated scripts to handle critical patching tasks."
                    ],
                    list: [
                        "Patching framework.jar, services.jar, miui-framework.jar, and miui-services.jar.",
                        "Addressing issues like China Notification Fix and signature verification.",
                        "Supporting local and remote workflows for flexibility."
                    ]
                }
            ]
        },
        date: "2023-09-01",
        readTime: "6 min read"
    },
]

export default function BlogPost() {
    const { id } = useParams<{ id: string }>()
    const postId = Number(id)
    const post = blogPosts.find(p => p.id === postId)

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <Card className="bg-gray-800 border-none text-white rounded-2xl shadow-lg p-8">
                    <CardContent>
                        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
                        <Link to="/blog">
                            <Button variant="ghost" className="hover:bg-gray-700">
                                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blog
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 py-16 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl mx-auto">
                <Link to="/blog">
                    <Button variant="ghost" className="mb-8 hover:bg-gray-800">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blog
                    </Button>
                </Link>
                <Card className="bg-gray-800 border-none text-white rounded-2xl shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8">
                        <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-300">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span className="mr-4">{post.date}</span>
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <p className="text-lg sm:text-xl">{post.content.introduction}</p>
                        {post.content.sections.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-2xl sm:text-3xl font-semibold mb-4">{section.title}</h2>
                                {section.content.map((para, i) => (
                                    <p key={i} className="mb-4 text-lg sm:text-xl">{para}</p>
                                ))}
                                {section.list && (
                                    <ul className="list-disc pl-6 space-y-2">
                                        {section.list.map((item, i) => (
                                            <li key={i} className="text-lg sm:text-xl">{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
