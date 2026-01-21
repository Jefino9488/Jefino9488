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
        <div className="min-h-screen text-foreground">
            {/* Header Section - Compact */}
            <section className="w-full py-4 sm:py-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10 hover:text-primary transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Certificates
                        </h1>
                    </div>

                    <div className="text-xs sm:text-sm text-muted-foreground font-medium px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        {certificates.length} Achieved
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {(certificates as Certificate[]).map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card
                                variant="default"
                                className="glass-crystal border-0 text-card-foreground rounded-[1.5rem] shadow-sm overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer group hover:shadow-xl hover:-translate-y-1 hover:bg-white/[0.03]"
                                onClick={() => setSelectedCert(cert)}
                            >
                                <CardHeader className="p-5 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-base sm:text-lg font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {cert.title}
                                            </CardTitle>
                                            <div className="flex flex-col gap-1 text-xs text-muted-foreground/80">
                                                <span className="flex items-center font-medium text-foreground/70">
                                                    {cert.issuer}
                                                </span>
                                                <span className="flex items-center opacity-70">
                                                    {cert.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 pt-2 flex-grow flex flex-col">
                                    <div className="mb-4 flex-grow">
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {cert.skills.slice(0, 3).map((skill) => (
                                                <Badge key={skill} className="bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/5 text-[10px] px-2 py-0.5 pointer-events-none">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {cert.skills.length > 3 && (
                                                <Badge className="bg-transparent text-muted-foreground/50 border border-white/5 text-[10px] px-1.5 py-0.5">
                                                    +{cert.skills.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs sm:text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span>View Details</span>
                                        <div className="p-1 rounded-full bg-primary/10">
                                            <Eye className="h-3.5 w-3.5" />
                                        </div>
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
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
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative max-w-4xl w-full max-h-[85vh] overflow-hidden glass-crystal rounded-[2rem] shadow-2xl border-0 ring-1 ring-white/10 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex-shrink-0 bg-white/5 backdrop-blur-xl border-b border-white/5 p-5 flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground pr-8 mb-1">{selectedCert.title}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                            <Award className="mr-1.5 h-3.5 w-3.5 text-primary" />
                                            {selectedCert.issuer}
                                        </span>
                                        <span className="flex items-center text-muted-foreground/60">
                                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                            {selectedCert.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="overflow-y-auto p-5 sm:p-6 custom-scrollbar">
                                {/* Certificate Image */}
                                {selectedCert.imageUrl && (
                                    <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-6 group">
                                        {selectedCert.imageUrl.includes(".pdf") ? (
                                            <iframe
                                                src={`${selectedCert.imageUrl}#toolbar=0&navpanes=0`}
                                                title={`${selectedCert.title} PDF Certificate`}
                                                className="w-full h-[50vh] min-h-[300px] rounded-xl"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                src={selectedCert.imageUrl}
                                                alt={`${selectedCert.title} Certificate`}
                                                className="w-full h-auto rounded-xl object-contain max-h-[50vh] mx-auto"
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYxNjE2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIHVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                                                }}
                                            />
                                        )}
                                        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5 rounded-xl"></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-2">Description</h3>
                                        <p className="text-foreground/90 text-sm leading-relaxed mb-6">{selectedCert.description}</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCert.skills.map((skill) => (
                                                    <Badge key={skill} className="bg-white/5 text-foreground border border-white/10 hover:bg-white/10 transition-colors">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Verify Button */}
                                        {selectedCert.credentialUrl && (
                                            <Button
                                                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                                asChild
                                            >
                                                <a
                                                    href={selectedCert.credentialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Verify Credential
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}