import { useState } from "react";
import { ExternalLink } from "lucide-react";
import certificates from "@/certifications/certifications.json";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import NextPageLink from "./NextPageLink";
import CertificatesGallery from "./CertificatesGallery";

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
    <div className="theme-light min-h-screen bg-sage">
      <PageHeader
        title="Certifications Ledger"
        meta={`${certList.length} Credentials`}
      />

      <div className="relative mx-auto max-w-[90rem] space-y-16 overflow-hidden px-4 pb-24 pt-10 sm:px-8 sm:pt-12">
        {/* Intro — staircase headline over ghost numeral */}
        <Reveal>
          <div className="relative space-y-8">
            <p
              aria-hidden
              className="ghost-type pointer-events-none absolute -right-6 -top-16 select-none text-[42vw] leading-none sm:text-[30vw]"
            >
              {certList.length}
            </p>

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="label-bracket font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
                  Index
                </p>
                <h1
                  className="mt-4 font-poppins font-semibold leading-none"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  <span className="block">Credentials</span>
                  <span className="block pl-[10%]">&amp; licenses</span>
                </h1>
              </div>

              <p className="max-w-xs text-pretty text-sm leading-relaxed text-fg-muted lg:pb-2 lg:text-right">
                A registry of professional certifications across machine
                learning, networking infrastructure, and automation engineering.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Categorized ledger */}
        <div className="space-y-14">
          {categories.map((category, ci) => (
            <section key={category.name} className="space-y-5">
              <Reveal delay={Math.min(ci * 0.05, 0.15)}>
                <div className="space-y-1.5">
                  <p className="font-mono text-[11px] tabular-nums text-primary">
                    ({String(ci + 1).padStart(2, "0")})
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
                    <div
                      onClick={() => setIsGalleryOpen(true)}
                      className="group relative grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 border-b border-line py-5 transition-colors hover:bg-surface/50 sm:grid-cols-[3rem_1fr_10rem_auto] sm:gap-x-6 sm:py-6"
                    >
                      {/* Count column */}
                      <span
                        aria-hidden
                        className="index-num self-start pt-0.5 text-xl leading-none sm:text-2xl"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 space-y-1.5 px-1">
                        <h3 className="text-base font-semibold tracking-tight text-sage-ink transition-colors group-hover:text-primary sm:text-lg">
                          {cert.title}
                        </h3>
                        <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-fg-muted">
                          {cert.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
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

                      {/* Issuer / date column */}
                      <div className="hidden space-y-1 text-right font-mono text-[11px] sm:block">
                        <p className="font-medium text-sage-ink">
                          {cert.issuer}
                        </p>
                        <p className="tabular-nums text-fg-faint">
                          {cert.date}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 px-1 sm:self-center">
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Verify ${cert.title} authenticity`}
                            className="rounded-full p-2 text-fg-faint transition-colors hover:text-sage-ink"
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

      {/* Inspection Gallery */}
      <CertificatesGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        certificates={certList}
      />
    </div>
  );
}
