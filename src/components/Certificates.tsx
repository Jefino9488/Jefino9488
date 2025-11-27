import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Calendar, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import certificates from "@/certifications/certifications.json"

export default function Certificates() {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {certificates.map((cert) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl sm:text-2xl font-semibold mb-2 text-primary">
                                                {cert.title}
                                            </CardTitle>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Award className="mr-2 h-4 w-4 text-primary" />
                                                    {cert.issuer}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                                                    {cert.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-foreground mb-4">{cert.description}</p>

                                    <div className="mt-4 space-y-4">
                                        {cert.imageUrl && (
                                            <div className="relative rounded-lg overflow-hidden bg-muted p-2">
                                                {cert.imageUrl.includes(".pdf") ? (
                                                    <iframe
                                                        src={`${cert.imageUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                        title={`${cert.title} PDF Certificate`}
                                                        className="w-full h-auto aspect-[4/3] rounded-lg pointer-events-none"
                                                        loading="lazy"
                                                    />

                                                ) : (
                                                    <img
                                                        src={cert.imageUrl}
                                                        alt={`${cert.title} Certificate`}
                                                        className="w-full h-auto rounded-lg object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            // Keep the SVG placeholder as is for now, or replace with a simpler fallback if needed.
                                                            // The SVG contains hardcoded colors but it's a data URI.
                                                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzEzMjQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NiYTZmNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNlcnRpZmljYXRlPC90ZXh0Pjwvc3ZnPg==';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-primary text-lg font-medium mb-2">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {cert.skills.map((skill) => (
                                                    <Badge key={skill} className="bg-secondary hover:bg-secondary/80 text-foreground border-none">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {cert.credentialUrl && (
                                        <div className="mt-4">
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
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