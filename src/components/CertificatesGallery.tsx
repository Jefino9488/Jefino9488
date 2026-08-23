import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Certificate {
  id: string | number;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  credentialUrl?: string | null;
}

interface CertificatesGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: Certificate[];
}

/**
 * Normalizes aspect ratios, positions, and zoom offsets so that:
 * - Coursera Specialization (cert3) has ZERO top cropping on the seal/logo.
 * - Cisco CCNA has its extra top/bottom empty margins neatly trimmed.
 * - Coursera & IBM single course certificates cleanly bleed edge-to-edge.
 */
function getCardConfig(cert: Certificate) {
  // 1. Streetcred badge (clean 1:1 circular badge)
  if (cert.id === "cert1" || cert.issuer === "TUBLIAN") {
    return {
      aspect: "aspect-square",
      scale: "scale-100 group-hover:scale-105",
      position: "object-center",
    };
  }
  // 2. Coursera Specialization (cert3) — keep full top seal & logo uncropped!
  if (cert.id === "cert3") {
    return {
      aspect: "aspect-[1.28/1]",
      scale: "scale-[1.01] group-hover:scale-[1.05]",
      position: "object-top",
    };
  }
  // 3. Coursera & IBM single course certificates (trim blank outer margins)
  if (cert.imageUrl?.includes("coursera_assets")) {
    return {
      aspect: "aspect-[1.32/1]",
      scale: "scale-[1.10] group-hover:scale-[1.15]",
      position: "object-center",
    };
  }
  // 4. Cisco CCNA & Python certificates (trim top & bottom empty padding)
  if (cert.issuer?.includes("Cisco") || typeof cert.id === "number") {
    return {
      aspect: "aspect-[1.48/1]",
      scale: "scale-[1.10] group-hover:scale-[1.15]",
      position: "object-center",
    };
  }
  // 5. Standard UiPath and other certificates
  return {
    aspect: "aspect-[1.414/1]",
    scale: "scale-[1.02] group-hover:scale-[1.07]",
    position: "object-center",
  };
}

export default function CertificatesGallery({
  isOpen,
  onClose,
  certificates,
}: CertificatesGalleryProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#050505] animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent px-6 py-6 sm:px-12 sm:py-8">
        <h2 className="font-poppins text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          Credentials Gallery
        </h2>
        <button
          onClick={onClose}
          className="press rounded-full bg-white/10 px-5 py-2.5 font-mono text-xs text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          Close gallery
        </button>
      </div>

      {/* Masonry Grid */}
      <div className="mx-auto w-full max-w-[120rem] px-6 pb-20 sm:px-12">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {certificates
            .filter((c) => c.imageUrl)
            .map((cert, index) => {
              const config = getCardConfig(cert);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  key={cert.id}
                  className={`group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${config.aspect}`}
                >
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    loading="lazy"
                    className={`h-full w-full object-cover ${config.position} transition-transform duration-700 ${config.scale}`}
                  />

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${cert.title} verification`}
                      className="absolute right-3 top-3 z-20 rounded-full bg-black/60 p-2 text-white/80 opacity-0 backdrop-blur-md transition-all hover:bg-black hover:text-white group-hover:opacity-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="p-5 sm:p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/70">
                        {cert.issuer}
                      </p>
                      <h3 className="mt-1 text-sm font-medium text-white sm:text-base">
                        {cert.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
