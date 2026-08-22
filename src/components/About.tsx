import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Github } from "./icons/Github";
import { Linkedin } from "./icons/Linkedin";
import Reveal from "./Reveal";
import NextPageLink from "./NextPageLink";
import certificates from "@/certifications/certifications.json";

interface TimelineEntry {
  year: string;
  title: string;
  category: string;
  description: string;
}

const journeyTimeline: TimelineEntry[] = [
  {
    year: "2021",
    title: "Android ROM & systems exploration",
    category: "Systems & Linux",
    description:
      "Began compiling custom Android kernels and vendor ROMs. Gained in-depth knowledge of Linux internals, partition structures, and system service hooks.",
  },
  {
    year: "2022",
    title: "AI & Data Science degree started",
    category: "Education & Foundations",
    description:
      "Enrolled in Bachelor of Technology in Artificial Intelligence & Data Science. Explored data pipelines, statistics, Python frameworks, and algorithms.",
  },
  {
    year: "2023",
    title: "Full-stack web engineering",
    category: "Full-Stack Development",
    description:
      "Expanded into production web engineering with React, TypeScript, FastAPI, and Node.js. Built scalable web architectures and RESTful microservices.",
  },
  {
    year: "2024",
    title: "FrameworkPatcher & open-source tooling",
    category: "Automation & Tooling",
    description:
      "Created FrameworkPatcher, an automated framework patcher for OEM Android ROMs. Earned DeepLearning.AI TensorFlow Developer certification.",
  },
  {
    year: "2025",
    title: "AI agents & advanced networking",
    category: "AI & Systems",
    description:
      "Developed multimodal browser testing agents and LLM tooling. Earned Cisco CCNA accreditation covering modern routing, switching, and automation.",
  },
];

const focusAreas = [
  {
    index: "01",
    title: "Systems & Android tooling",
    description:
      "Custom framework patchers, automated partition flashers, and kernel-level root modules for reproducible Android modifications.",
  },
  {
    index: "02",
    title: "Full-stack web engineering",
    description:
      "Performant, accessible web apps using React, TypeScript, Node.js, and modern CSS systems with clean state management.",
  },
  {
    index: "03",
    title: "AI & automation",
    description:
      "Intelligent automation pipelines, multimodal browser agents, and practical ML applications with TensorFlow & PyTorch.",
  },
  {
    index: "04",
    title: "Open source & tooling",
    description:
      "Publishing developer utilities and maintaining software used by thousands across developer communities.",
  },
];

const technicalSkills = [
  { category: "Languages", skills: ["Python", "TypeScript", "JavaScript", "Java", "Bash / Shell", "SQL"] },
  { category: "Web & Backend", skills: ["React", "Node.js", "Express", "FastAPI", "Flask", "Tailwind CSS", "REST APIs"] },
  { category: "Systems & AI", skills: ["Android Internals", "Linux", "TensorFlow", "PyTorch", "Git", "Docker", "Cisco Networking"] },
];

const inputBase =
  "w-full rounded-xl border bg-surface/70 px-4 py-3 font-mono text-xs text-[#f2f5f5] backdrop-blur-sm transition-colors placeholder:text-fg-faint focus:border-primary focus:outline-none";

export default function About() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      );
      const mailtoLink = `mailto:jefinojacob9488@gmail.com?subject=${subject}&body=${body}`;
      window.open(mailtoLink, "_blank");

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen text-[#f2f5f5]">
      <div className="relative mx-auto max-w-6xl space-y-24 px-4 pb-24 pt-14 sm:px-8 sm:pt-20">
        {/* ================================================================ */}
        {/* Intro                                                            */}
        {/* ================================================================ */}
        <section className="relative">
          <div aria-hidden className="ambient-glow -top-20 left-1/4 h-80 w-80" />
          <Reveal>
            <a
              href="https://my-drive.pages.dev/Public/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="press mb-8 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 font-mono text-xs text-fg-muted backdrop-blur-sm transition-colors hover:border-line-strong hover:text-[#f2f5f5]"
            >
              <Download className="h-3.5 w-3.5" />
              Resume (PDF)
            </a>
          </Reveal>

          <div className="flex flex-col-reverse items-start justify-between gap-10 md:flex-row">
            <div className="flex-1 space-y-6">
              <Reveal y={12}>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
                  Biography
                </p>
                <h1
                  className="mt-4 font-poppins font-semibold leading-[1.02]"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}
                >
                  I&apos;m Jefino<span className="text-primary">.</span>
                </h1>
                <p className="pt-3 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
                  AI &amp; Data Science undergrad · Full-stack engineer
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <p className="max-w-xl text-pretty leading-relaxed text-fg-muted">
                  Based in Chennai, India — working across systems engineering,
                  Android automation tooling, and artificial intelligence. I
                  build software that bridges low-level system interactions with
                  modern, clean interfaces.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { href: "https://github.com/Jefino9488", label: "GitHub", icon: Github },
                    { href: "https://www.linkedin.com/in/jefino9488/", label: "LinkedIn", icon: Linkedin },
                    { href: "mailto:jefinojacob9488@gmail.com", label: "Email", icon: Mail },
                  ].map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="press inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 font-mono text-xs text-[#f2f5f5] backdrop-blur-sm transition-colors hover:border-line-strong hover:bg-elevated"
                    >
                      <Icon className="h-3.5 w-3.5 text-fg-muted" />
                      {label}
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Portrait */}
            <Reveal delay={0.1} y={26} className="shrink-0">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -right-3 -top-3 h-full w-full rounded-4xl border border-line-strong"
                />
                <div className="relative h-36 w-36 overflow-hidden rounded-4xl border border-line bg-surface shadow-lift sm:h-44 sm:w-44">
                  <img
                    src="/profile/profile.jpg"
                    alt="Jefino portrait"
                    className="h-full w-full object-cover"
                    width="176"
                    height="176"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Focus bento                                                      */}
        {/* ================================================================ */}
        <section>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
              What I do
            </p>
            <div aria-hidden className="mt-4 h-px w-full bg-gradient-to-r from-line-strong to-transparent" />
          </Reveal>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {focusAreas.map((area, i) => (
              <Reveal key={area.index} delay={i * 0.06}>
                <div className="tile tile-interactive group h-full space-y-3 p-6 sm:p-7">
                  <p className="font-mono text-[11px] tabular-nums text-primary">{area.index}</p>
                  <h2 className="text-base font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-lg">
                    {area.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-fg-muted">{area.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* Timeline                                                         */}
        {/* ================================================================ */}
        <section>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
              Journey
            </p>
            <h2 className="type-title mt-2">Milestones</h2>
          </Reveal>

          <div className="mt-9 space-y-0 border-l border-line">
            {journeyTimeline.map((item, i) => (
              <Reveal key={item.year} delay={Math.min(i * 0.05, 0.25)}>
                <div className="group relative space-y-2 py-6 pl-7">
                  <div className="absolute -left-[5px] top-8 h-2.5 w-2.5 rounded-full border border-line-strong bg-background transition-colors group-hover:border-primary group-hover:bg-primary" />

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px]">
                    <span className="font-semibold tabular-nums text-primary">{item.year}</span>
                    <span className="uppercase tracking-[0.16em] text-fg-faint">{item.category}</span>
                  </div>

                  <h3 className="text-base font-medium text-[#f2f5f5] sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-fg-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* Skills band                                                      */}
        {/* ================================================================ */}
        <section>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
              Competencies
            </p>
            <h2 className="type-title mt-2">Technical stack</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="tile mt-7 grid grid-cols-1 divide-y divide-line p-2 md:grid-cols-3 md:divide-x md:divide-y-0">
              {technicalSkills.map((group) => (
                <div key={group.category} className="space-y-3.5 p-5">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-faint">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] text-[#f2f5f5] transition-colors hover:border-line-strong"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ================================================================ */}
        {/* Credentials                                                       */}
        {/* ================================================================ */}
        <section>
          <Reveal>
            <div className="tile flex flex-col items-center justify-between gap-4 p-7 sm:flex-row">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center justify-center gap-2 sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <h2 className="text-base font-semibold text-[#f2f5f5]">
                    Verified certifications ({certificates.length})
                  </h2>
                </div>
                <p className="text-xs text-fg-muted">
                  Accreditations from DeepLearning.AI, IBM, Cisco, and TensorFlow.
                </p>
              </div>
              <Link
                to="/certificates"
                className="press inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-[#f2f5f5] transition-colors hover:border-line-strong"
              >
                View all credentials
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ================================================================ */}
        {/* Contact form                                                     */}
        {/* ================================================================ */}
        <section>
          <Reveal>
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
                Contact
              </p>
              <h2 className="type-title">Get in touch</h2>
              <p className="max-w-md text-sm leading-relaxed text-fg-muted">
                Have a project, idea, or open-source inquiry? Send a message and
                it opens straight in your mail client.
              </p>
            </div>
          </Reveal>

          {isSubmitted && (
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-xs text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Message prepared. Your default email client will open.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-2xl space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={`${inputBase} ${errors.name ? "border-destructive" : "border-line"}`}
                />
                {errors.name && (
                  <p className="font-mono text-[11px] text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={`${inputBase} ${errors.email ? "border-destructive" : "border-line"}`}
                />
                {errors.email && (
                  <p className="font-mono text-[11px] text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-subject" className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Project discussion / collaboration"
                aria-invalid={!!errors.subject}
                className={`${inputBase} ${errors.subject ? "border-destructive" : "border-line"}`}
              />
              {errors.subject && (
                <p className="font-mono text-[11px] text-destructive">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Tell me about your project or inquiry..."
                aria-invalid={!!errors.message}
                className={`${inputBase} resize-none ${errors.message ? "border-destructive" : "border-line"}`}
              />
              {errors.message && (
                <p className="font-mono text-[11px] text-destructive">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="press inline-flex items-center gap-2 rounded-full bg-[#f2f5f5] px-6 py-3 text-sm font-medium text-[#050708] shadow-card transition-all hover:bg-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send message</span>
                </>
              )}
            </button>
          </form>
        </section>

        <NextPageLink to="/certificates" title="Credentials" />
      </div>
    </div>
  );
}
