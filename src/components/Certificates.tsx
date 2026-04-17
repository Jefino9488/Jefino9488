import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ExternalLink, Award, X, ShieldCheck } from "lucide-react"
import certificates from "@/certifications/certifications.json"
import { useState, useEffect, useCallback } from "react"
import PageHeader from "./PageHeader"
import { createPortal } from "react-dom"

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
        <div className="min-h-screen text-foreground relative selection:bg-primary/30">
            <PageHeader 
                title="Credentials Database"
                icon={ShieldCheck}
                meta={`${certificates.length} Verified`}
            />

            <div className="container mx-auto px-4 py-24 sm:py-32 max-w-7xl relative z-10">
                
                {/* Techy Intro Text */}
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-[#8ab8d0] font-mono text-xs sm:text-sm uppercase tracking-[0.3em] mb-4">Secure Ledger</h2>
                    <p className="text-[#b3bad9] text-lg sm:text-xl font-light leading-relaxed">
                        A curated registry of professional certifications, specialized training, and authenticated accreditations.
                    </p>
                </div>

                {/* ID Badge Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {(certificates as Certificate[]).map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="cursor-pointer group"
                            onClick={() => setSelectedCert(cert)}
                        >
                            {/* "Access Card" / ID Badge Design */}
                            <div className="relative w-full h-[380px] bg-[#1e1a33]/30 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden flex flex-col transition-all duration-500 hover:border-primary/50 hover:bg-[#1e1a33]/60 hover:shadow-[0_0_30px_-5px_rgba(102,111,188,0.3)] hover:-translate-y-2">
                                
                                {/* Holographic grid background */}
                                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/40 transition-colors duration-700" />

                                {/* Lanyard clip detail */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-white/5 border border-white/10" />

                                <div className="p-8 flex flex-col h-full relative z-10 pt-12">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase font-mono text-[#8ab8d0] tracking-[0.2em] mb-1">Status</span>
                                            <span className="text-[10px] uppercase font-mono text-green-400 tracking-[0.2em]">Verified</span>
                                        </div>
                                        <Award className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                                    </div>

                                    {/* Title Section */}
                                    <div className="relative z-10 pb-6 border-b border-white/5 mb-6 flex-grow">
                                        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-white leading-[1.2] mb-3 group-hover:text-primary transition-colors line-clamp-3">
                                            {cert.title}
                                        </h3>
                                        <p className="text-xs uppercase font-mono text-[#b3bad9] tracking-widest line-clamp-1">
                                            {cert.issuer}
                                        </p>
                                    </div>

                                    {/* Footer Section */}
                                    <div className="mt-auto relative z-10 flex items-end justify-between">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[9px] uppercase font-mono text-white/30 tracking-[0.2em]">Issued On</span>
                                            <span className="text-xs font-mono text-white/80 tracking-widest">{cert.date}</span>
                                        </div>
                                        
                                        {/* Fake Barcode */}
                                        <div className="h-8 flex items-end opacity-20 group-hover:opacity-60 transition-opacity">
                                            <div className="w-1 h-full bg-white mr-[3px]" />
                                            <div className="w-[2px] h-full bg-white mr-[4px]" />
                                            <div className="w-[3px] h-3/4 bg-white mr-[2px]" />
                                            <div className="w-[1px] h-full bg-white mr-[4px]" />
                                            <div className="w-1 h-5/6 bg-white mr-[2px]" />
                                            <div className="w-[2px] h-full bg-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Certificate Modal - Portal to escape framer-motion transform containment */}
            {createPortal(
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
                            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                            onClick={() => setSelectedCert(null)}
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </motion.button>

                        {/* Modal Content container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative max-w-4xl w-full max-h-[90vh] bg-background/95 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-[0_0_50px_-10px_rgba(102,111,188,0.3)] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex-shrink-0 bg-white/[0.02] border-b border-white/5 p-6 sm:p-8 flex flex-col gap-4">
                                <span className="inline-flex items-center self-start gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-400 uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verified Record
                                </span>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-white mb-2">{selectedCert.title}</h2>
                                    <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-mono text-[#b3bad9]/80 uppercase tracking-widest">
                                        <span className="flex items-center text-primary">
                                            {selectedCert.issuer}
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <span className="flex items-center">
                                            {selectedCert.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                                {/* Certificate Image / Render — Fixed scaling bounds! */}
                                {selectedCert.imageUrl && (
                                    <div className="relative rounded-[1.5rem] overflow-hidden bg-black/40 border border-white/5 mb-8 p-4 sm:p-8 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50 pointer-events-none" />
                                        {selectedCert.imageUrl.includes(".pdf") ? (
                                            <iframe
                                                src={`${selectedCert.imageUrl}#toolbar=0&navpanes=0`}
                                                title={`${selectedCert.title} PDF Certificate`}
                                                className="w-full aspect-[1.414/1] max-h-[50vh] rounded-xl shadow-lg relative z-10"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                src={selectedCert.imageUrl}
                                                alt={`${selectedCert.title} Certificate`}
                                                className="w-full h-auto max-h-[40vh] object-contain relative z-10 filter drop-shadow-2xl mx-auto"
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYxNjE2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIHVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8ab8d0] mb-3">Credential Details</h3>
                                            <p className="text-[#b3bad9] text-base leading-[1.8] font-light">
                                                {selectedCert.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-fit">
                                        <div>
                                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-4">Competencies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCert.skills.map((skill) => (
                                                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/5 text-[10px] font-mono text-white/80 uppercase tracking-widest">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedCert.credentialUrl && (
                                            <div className="pt-6 border-t border-white/5">
                                                <Button
                                                    className="w-full gap-2 bg-primary hover:bg-white text-primary-foreground hover:text-black rounded-xl font-semibold shadow-[0_0_15px_-3px_rgba(102,111,188,0.4)] transition-all h-12"
                                                    asChild
                                                >
                                                    <a
                                                        href={selectedCert.credentialUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        Verify Authenticity
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}