import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
    {
        id: 1,
        title: "Getting Started with FrameworkPatcher",
        content: {
            introduction: "FrameworkPatcher is an advanced tool designed to help users modify MIUI and Hyper frameworks, specifically for Xiaomi devices running A14 to A15. It simplifies the process of customizing system frameworks, making it accessible even for non-technical users.",
            sections: [
                {
                    title: "Why FrameworkPatcher?",
                    content: [
                        "Customizing system frameworks can be complex and prone to errors. FrameworkPatcher bridges the gap, providing a user-friendly interface and automated scripts to handle critical patching tasks.",
                        "Whether you're a developer or an enthusiast, FrameworkPatcher empowers you to take control of your device's framework without the hassle of manual modifications."
                    ],
                    list: [
                        "Patching framework.jar, services.jar, miui-framework.jar, and miui-services.jar.",
                        "Addressing issues like China Notification Fix and signature verification.",
                        "Supporting local and remote workflows for flexibility."
                    ]
                },
                {
                    title: "Key Features of FrameworkPatcher",
                    content: [
                        "FrameworkPatcher offers a range of features that make it an essential tool for anyone looking to customize their Xiaomi device's framework."
                    ],
                    list: [
                        "China Notification Fix: Resolves notification issues on CN ROMs.",
                        "Core Patch: Fully disables signature verification for system apps.",
                        "Disable Flag Secure: Allows screenshots in apps that normally block them.",
                        "Multi-Floating Window: Increases the limit of floating windows to 50.",
                        "Add Gboard: Replaces the default keyboard with Google's Gboard."
                    ]
                },
                {
                    title: "How to Use FrameworkPatcher",
                    content: [
                        "Using FrameworkPatcher is straightforward, whether you're working locally or remotely. Here's a step-by-step guide to get you started:"
                    ],
                    list: [
                        "Visit the FrameworkPatcher website and provide the direct URLs of the framework files.",
                        "Enter the device name and ROM version correctly.",
                        "Click on the Build button and monitor the progress in the workflow.",
                        "Once the build is successful, download the patched files from the release section."
                    ]
                },
                {
                    title: "Local Patching with FrameworkPatcher",
                    content: [
                        "For those who prefer to work locally, FrameworkPatcher provides a `LocalPatch.sh` script that automates the patching process."
                    ],
                    list: [
                        "Clone the FrameworkPatcher repository to your local machine.",
                        "Place the required JAR files (e.g., framework.jar, services.jar) in the directory.",
                        "Run the `LocalPatch.sh` script to start the patching process.",
                        "The script will handle decompilation, modification, and recompilation of the framework files."
                    ]
                },
                {
                    title: "Contributing to FrameworkPatcher",
                    content: [
                        "FrameworkPatcher is an open-source project, and contributions are highly encouraged. Here's how you can contribute:"
                    ],
                    list: [
                        "Fork the project on GitHub.",
                        "Create a new branch for your feature or bug fix.",
                        "Commit your changes and push them to your branch.",
                        "Submit a pull request and wait for the review.",
                        "Once approved, your changes will be merged into the main project."
                    ]
                }
            ]
        },
        date: "2023-09-01",
        readTime: "6 min read"
    },
];

export default function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const postId = Number(id);
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <Card className="bg-gray-800 border-none text-white rounded-2xl shadow-lg p-8">
                    <CardContent>
                        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
                        <Link to="/blog">
                            <Button variant="ghost" className="mb-8 hover:bg-gray-700 hover:text-white transition-colors">
                                <ArrowLeft className="mr-2 h-5 w-5 text-white" /> Back to Blog
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 py-16 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl mx-auto">
                <Link to="/blog">
                    <Button variant="ghost" className="mb-8 hover:bg-gray-800 hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5 text-white" /> Back to Blogs
                    </Button>
                </Link>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">{post.content.introduction}</p>
                            {post.content.sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-purple-400">{section.title}</h2>
                                    {section.content.map((para, i) => (
                                        <p key={i} className="mb-4 text-lg sm:text-xl text-gray-300 leading-relaxed">{para}</p>
                                    ))}
                                    {section.list && (
                                        <ul className="list-disc pl-6 space-y-2">
                                            {section.list.map((item, i) => (
                                                <li key={i} className="text-lg sm:text-xl text-gray-300 leading-relaxed">{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}