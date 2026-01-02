import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Calendar, Award, Eye, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import certificates from "@/certifications/certifications.json"
import { useState, useEffect, useCallback } from "react"

interface Certificate {
    id: string
    title: string
    issuer: string
    date: string
    description: string
    imageUrl?: string
    skills: string[]
    credentialUrl?: string
}

export default function Certificates() {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

    // Handle escape key to close modal
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setSelectedCert(null)
        }
    }, [])

    useEffect(() => {
        if (selectedCert) {
            document.addEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "unset"
        }
    }, [selectedCert, handleKeyDown])

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header Section - Full Width */}
            <section className="w-full py-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/">
                            <Button variant="ghost" className="hover:bg-secondary hover:text-foreground transition-colors">
                                <ArrowLeft className="mr-2 h-5 w-5 text-primary" /> Back to Home
                            </Button>
                        </Link>
                    </div>

                    <header className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-primary">My Certificates</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Professional certifications and achievements that showcase my expertise and continuous learning
                        </p>
                    </header>
                </div>
            </section>

            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(certificates as Certificate[]).map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Card
                                className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer group"
                                onClick={() => setSelectedCert(cert)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg sm:text-xl font-semibold mb-2 text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                                                {cert.title}
                                            </CardTitle>
                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Award className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                                                    <span className="truncate">{cert.issuer}</span>
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                                                    {cert.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <p className="text-foreground text-sm mb-4 line-clamp-2">{cert.description}</p>

                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {cert.skills.slice(0, 3).map((skill) => (
                                                <Badge key={skill} className="bg-secondary hover:bg-secondary/80 text-foreground border-none text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {cert.skills.length > 3 && (
                                                <Badge className="bg-secondary/50 text-muted-foreground border-none text-xs">
                                                    +{cert.skills.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-border">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedCert(cert)
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Certificate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Certificate Modal/Lightbox */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedCert(null)}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.1 }}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            onClick={() => setSelectedCert(null)}
                            aria-label="Close modal"
                        >
                            <X className="h-6 w-6" />
                        </motion.button>

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto bg-card rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-primary pr-8">{selectedCert.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center">
                                        <Award className="mr-2 h-4 w-4 text-primary" />
                                        {selectedCert.issuer}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                                        {selectedCert.date}
                                    </span>
                                </div>
                            </div>

                            {/* Certificate Image */}
                            <div className="p-4 sm:p-6">
                                {selectedCert.imageUrl && (
                                    <div className="relative rounded-xl overflow-hidden bg-muted mb-6">
                                        {selectedCert.imageUrl.includes(".pdf") ? (
                                            <iframe
                                                src={`${selectedCert.imageUrl}#toolbar=0&navpanes=0`}
                                                title={`${selectedCert.title} PDF Certificate`}
                                                className="w-full h-[60vh] min-h-[400px] rounded-xl"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                src={selectedCert.imageUrl}
                                                alt={`${selectedCert.title} Certificate`}
                                                className="w-full h-auto rounded-xl object-contain max-h-[70vh]"
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzEzMjQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NiYTZmNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNlcnRpZmljYXRlPC90ZXh0Pjwvc3ZnPg==';
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-foreground mb-6">{selectedCert.description}</p>

                                {/* Skills */}
                                <div className="mb-6">
                                    <h3 className="text-primary text-lg font-medium mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCert.skills.map((skill) => (
                                            <Badge key={skill} className="bg-secondary hover:bg-secondary/80 text-foreground border-none">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Verify Button */}
                                {selectedCert.credentialUrl && (
                                    <a
                                        href={selectedCert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Verify Certificate
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}