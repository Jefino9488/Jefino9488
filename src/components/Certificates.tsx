import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Calendar, Award, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Certificate data structure
interface Certificate {
    id: string
    title: string
    issuer: string
    date: string
    description: string
    skills: string[]
    credentialUrl?: string
    imageUrl?: string
}

// Sample certificate data - replace with your actual certificates
const certificates: Certificate[] = [
    {
        id: "cert1",
        title: "Full Stack Web Development",
        issuer: "Udemy",
        date: "June 2023",
        description:
            "Comprehensive course covering modern web development technologies including React, Node.js, and MongoDB.",
        skills: ["React", "Node.js", "MongoDB", "Express"],
        credentialUrl: "https://www.udemy.com/certificate/example",
        imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
        id: "cert2",
        title: "Python for Data Science",
        issuer: "Coursera",
        date: "March 2023",
        description:
            "Advanced Python programming with focus on data analysis, visualization, and machine learning applications.",
        skills: ["Python", "Pandas", "NumPy", "Matplotlib"],
        credentialUrl: "https://www.coursera.org/certificate/example",
        imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
        id: "cert3",
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "January 2023",
        description:
            "Professional certification validating expertise in developing, deploying, and debugging cloud-based applications using AWS.",
        skills: ["AWS", "Cloud Computing", "Serverless", "Lambda"],
        credentialUrl: "https://aws.amazon.com/certification/example",
        imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
        id: "cert4",
        title: "JavaScript Algorithms and Data Structures",
        issuer: "freeCodeCamp",
        date: "November 2022",
        description: "Mastery of JavaScript fundamentals, algorithms, and data structures with practical applications.",
        skills: ["JavaScript", "Algorithms", "Data Structures", "Problem Solving"],
        credentialUrl: "https://www.freecodecamp.org/certification/example",
        imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
        id: "cert5",
        title: "UI/UX Design Fundamentals",
        issuer: "Interaction Design Foundation",
        date: "August 2022",
        description: "Comprehensive training in user interface and user experience design principles and best practices.",
        skills: ["UI Design", "UX Research", "Wireframing", "Prototyping"],
        credentialUrl: "https://www.interaction-design.org/certificate/example",
        imageUrl: "/placeholder.svg?height=400&width=600",
    },
]

export default function Certificates() {
    const [expandedCert, setExpandedCert] = useState<string | null>(null)

    const toggleExpand = (certId: string) => {
        setExpandedCert(expandedCert === certId ? null : certId)
    }

    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4]">
            {/* Header Section - Full Width */}
            <section className="w-full py-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/">
                            <Button variant="ghost" className="hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                                <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                            </Button>
                        </Link>
                    </div>

                    <header className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-[#cba6f7]">My Certificates</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Professional certifications and achievements that showcase my expertise and continuous learning
                        </p>
                    </header>
                </div>
            </section>

            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {certificates.map((cert) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden hover:border-[#cba6f7]/50 transition-all duration-300 h-full flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl sm:text-2xl font-semibold mb-2 text-[#f5c2e7]">
                                                {cert.title}
                                            </CardTitle>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#a6adc8]">
                        <span className="flex items-center">
                          <Award className="mr-2 h-4 w-4 text-[#89b4fa]" />
                            {cert.issuer}
                        </span>
                                                <span className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                                    {cert.date}
                        </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#89b4fa] hover:text-[#f5c2e7] hover:bg-[#313244]"
                                            onClick={() => toggleExpand(cert.id)}
                                            aria-label={
                                                expandedCert === cert.id ? "Collapse certificate details" : "Expand certificate details"
                                            }
                                        >
                                            {expandedCert === cert.id ? <ChevronUp /> : <ChevronDown />}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-[#cdd6f4] mb-4">{cert.description}</p>

                                    {expandedCert === cert.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-4 space-y-4"
                                        >
                                            {cert.imageUrl && (
                                                <div className="relative rounded-lg overflow-hidden bg-[#313244] p-2">
                                                    <img
                                                        src={cert.imageUrl || "/placeholder.svg"}
                                                        alt={`${cert.title} Certificate`}
                                                        className="w-full h-auto rounded-lg object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-[#cba6f7] text-lg font-medium mb-2">Skills</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {cert.skills.map((skill) => (
                                                        <Badge key={skill} className="bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] border-none">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {cert.credentialUrl && (
                                        <div className="mt-4">
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-[#89b4fa] hover:text-[#f5c2e7] transition-colors"
                                            >
                                                <span className="mr-2">Verify Certificate</span>
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
