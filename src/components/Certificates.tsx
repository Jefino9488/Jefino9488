import { useState, useCallback, useEffect } from "react";
import { ExternalLink, Award, X, CheckCircle2 } from "lucide-react";
import certificates from "@/certifications/certifications.json";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import NextPageLink from "./NextPageLink";
import { createPortal } from "react-dom";

interface Certificate {
  id: string | number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  imageUrl?: string;
  skills: string[];
  credentialUrl?: string | null;
}

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedCert) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedCert, handleKeyDown]);

  const certList = certificates as Certificate[];

  const mlAiCertificates = certList.filter((c) =>
    ["DeepLearning.AI", "IBM"].includes(c.issuer),
  );
  const networkingCertificates = certList.filter(
    (c) => c.issuer === "Cisco" && c.title.startsWith("CCNA"),
  );
  const programmingAutomationCertificates = certList.filter(
    (c) =>
      !["DeepLearning.AI", "IBM"].includes(c.issuer) &&
      !(c.issuer === "Cisco" && c.title.startsWith("CCNA")),
  );

  const categories = [
    {
      name: "Machine learning & artificial intelligence",
      description:
        "TensorFlow developer specialization, deep learning architectures, and NLP.",
      items: mlAiCertificates,
    },
    {
      name: "Networking & enterprise systems",
      description:
        "Cisco Certified Network Associate (CCNA) routing, switching, security, and network automation.",
      items: networkingCertificates,
    },
    {
      name: "Programming & automation",
      description:
        "Python proficiencies, robotic process automation (RPA), and open-source accreditations.",
      items: programmingAutomationCertificates,
    },
  ];

  return (
    <div className="min-h-screen text-[#f2f5f5]">
      <PageHeader
        title="Certifications Ledger"
        meta={`${certList.length} Verified`}
      />

      <div className="relative mx-auto max-w-6xl space-y-16 px-4 pb-24 pt-14 sm:px-8 sm:pt-20">
        {/* Intro */}
        <Reveal>
          <div aria-hidden className="ambient-glow -top-16 right-0 h-64 w-64" />
          <div className="relative space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
              Verified registry
            </p>
            <h1
              className="max-w-[18ch] text-balance font-poppins font-semibold leading-[1.02]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.04em" }}
            >
              Professional accreditations.
            </h1>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
              A verified registry of professional certifications across machine
              learning, networking infrastructure, and automation engineering.
            </p>
          </div>
        </Reveal>

        {/* Categorized ledger */}
        <div className="space-y-14">
          {categories.map((category, ci) => (
            <section key={category.name} className="space-y-5">
              <Reveal delay={Math.min(ci * 0.05, 0.15)}>
                <div className="space-y-1.5">
                  <p className="font-mono text-[11px] tabular-nums text-primary">
                    {String(ci + 1).padStart(2, "0")}
                  </p>
                  <h2 className="type-title">{category.name}</h2>
                  <p className="text-xs leading-relaxed text-fg-muted">
                    {category.description}
                  </p>
                </div>
              </Reveal>

              <div className="border-t border-line">
                {category.items.map((cert, i) => (
                  <Reveal key={cert.id} delay={Math.min(i * 0.04, 0.2)}>
                    <div className="group relative flex flex-col justify-between gap-4 border-b border-line py-6 transition-colors hover:bg-surface/40 sm:flex-row sm:items-center sm:gap-6">
                      <div className="min-w-0 flex-1 space-y-2 px-1">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-fg-faint">
                          <span className="inline-flex items-center gap-1 font-medium text-success">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                          <span>·</span>
                          <span className="font-medium text-[#f2f5f5]">{cert.issuer}</span>
                          <span>·</span>
                          <span className="tabular-nums">{cert.date}</span>
                        </div>

                        <h3 className="text-base font-semibold tracking-tight text-[#f2f5f5] transition-colors group-hover:text-primary sm:text-lg">
                          {cert.title}
                        </h3>

                        <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-fg-muted">
                          {cert.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cert.skills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-line bg-inset px-2 py-0.5 font-mono text-[10px] text-fg-muted"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 px-1 sm:self-center">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="press inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3.5 py-1.5 font-mono text-xs text-[#f2f5f5] transition-colors hover:border-line-strong"
                        >
                          <Award className="h-3.5 w-3.5 text-primary" />
                          <span>Inspect</span>
                        </button>

                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Verify ${cert.title} authenticity`}
                            className="rounded-full p-2 text-fg-faint transition-colors hover:text-[#f2f5f5]"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>

        <NextPageLink to="/" title="Home" />
      </div>

      {/* Inspection modal */}
      {selectedCert &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedCert.title}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedCert(null)}
          >
            <div
              className="tile animate-scale-in max-h-[90vh] w-full max-w-2xl space-y-7 overflow-y-auto p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified record</span>
                  </div>
                  <h2 className="type-title">{selectedCert.title}</h2>
                  <p className="font-mono text-xs tabular-nums text-fg-muted">
                    Issued by {selectedCert.issuer} · {selectedCert.date}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCert(null)}
                  aria-label="Close dialog"
                  className="rounded-full p-1.5 text-fg-muted transition-colors hover:bg-elevated hover:text-[#f2f5f5]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedCert.imageUrl && (
                <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-line bg-inset p-3">
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    className="max-h-[40vh] w-full rounded-lg object-contain"
                  />
                </div>
              )}

              <div className="space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-faint">
                  Credential overview
                </p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  {selectedCert.description}
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-faint">
                  Demonstrated competencies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-xs text-[#f2f5f5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCert.credentialUrl && (
                <div className="flex justify-end border-t border-line pt-5">
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press inline-flex items-center gap-2 rounded-full bg-[#f2f5f5] px-5 py-2.5 font-mono text-xs font-medium text-[#050708] transition-all hover:bg-white"
                  >
                    <span>Verify authenticity</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
