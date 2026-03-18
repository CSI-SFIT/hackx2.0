"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/providers/theme-provider";

type CreditCard = {
  title: string;
  subtitle: string;
  description: string;
  href?: string;
  cta?: string;
};

const sections = {
  team: {
    label: "Core Team",
    accent: "#ff00a0",
    intro:
      "The passionate team behind HackX 2.0, bringing together technical expertise, creative vision, and community leadership to make this event possible.",
    colClass: "sm:grid-cols-2 lg:grid-cols-3",
    cards: [
      {
        title: "Event Organizers",
        subtitle: "Leadership",
        description:
          "The core organizing committee from CSI SFIT and GDG SFIT who conceptualized and executed HackX 2.0, handling everything from logistics to technical infrastructure.",
      },
      {
        title: "Technical Team",
        subtitle: "Development",
        description:
          "Full-stack developers, UI/UX designers, and system administrators who built the event platform, registration system, and digital experience.",
      },
      {
        title: "Community Champions",
        subtitle: "Outreach",
        description:
          "Student volunteers and ambassadors who spread the word, managed social media, and ensured seamless communication with participants.",
      },
    ],
  },
  acknowledgments: {
    label: "Special Thanks",
    accent: "#00f0ff",
    intro:
      "We extend our heartfelt gratitude to everyone who made HackX 2.0 possible through their support, guidance, and collaboration.",
    colClass: "sm:grid-cols-2 lg:grid-cols-3",
    cards: [
      {
        title: "Faculty Mentors",
        subtitle: "Guidance",
        description:
          "Our professors and faculty advisors who provided invaluable guidance, technical expertise, and institutional support throughout the planning process.",
      },
      {
        title: "Industry Partners",
        subtitle: "Sponsors",
        description:
          "Technology companies and startups who believed in our vision and provided sponsorship, prizes, and mentorship opportunities for participants.",
      },
      {
        title: "Alumni Network",
        subtitle: "Support",
        description:
          "Former students and industry professionals who volunteered as judges, mentors, and advisors, sharing their experience and expertise.",
      },
      {
        title: "Open Source Community",
        subtitle: "Foundation",
        description:
          "The countless developers and maintainers of open-source projects that form the backbone of our platform and make innovation accessible to all.",
      },
      {
        title: "Student Community",
        subtitle: "Participants",
        description:
          "All the brilliant students who participated, contributed ideas, provided feedback, and helped us create an inclusive, innovative environment.",
      },
      {
        title: "Beta Testers",
        subtitle: "Quality Assurance",
        description:
          "Early adopters who tested our platform, reported bugs, and provided suggestions that helped us deliver a smooth experience for everyone.",
      },
    ],
  },
} as const;

const sectionOrder = [
  {
    key: "team" as const,
    label: sections.team.label,
    accent: sections.team.accent,
  },
  {
    key: "acknowledgments" as const,
    label: sections.acknowledgments.label,
    accent: sections.acknowledgments.accent,
  },
] as const;

type SectionKey = (typeof sectionOrder)[number]["key"];

type CreditCardProps = CreditCard & {
  accent: string;
  isLightMode: boolean;
};

function InfoCard({
  title,
  subtitle,
  description,
  href,
  cta,
  accent,
  isLightMode,
}: CreditCardProps) {
  const content = (
    <>
      <div
        className={`cursor-target flex h-20 items-center justify-between border-2 px-4 text-sm font-bold uppercase tracking-widest xl:h-22 xl:text-[0.8125rem] ${
          isLightMode
            ? "border-black/10 bg-black/5 text-black/40"
            : "border-white/10 bg-white/5 text-white/30"
        }`}
        style={{ borderTopColor: accent }}
      >
        <span>{subtitle}</span>
        <span style={{ color: accent }}>💝</span>
      </div>
      <div>
        <p
          className={`cursor-target text-base font-black uppercase tracking-widest ${isLightMode ? "text-black" : "text-white"}`}
        >
          {title}
        </p>
        <p
          className={`cursor-target mt-2 text-sm leading-6 xl:text-[0.9375rem] xl:leading-relaxed ${isLightMode ? "text-black/65" : "text-white/65"}`}
        >
          {description}
        </p>
      </div>
      <span
        className="cursor-target mt-auto text-[11px] font-black uppercase tracking-widest xl:text-xs"
        style={{ color: accent }}
      >
        {cta ?? (href ? "Visit →" : "Thank You")}
      </span>
    </>
  );

  const className = `cursor-target pointer-events-auto group flex h-full flex-col gap-4 border-2 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
    isLightMode
      ? "border-black/15 bg-white/72 text-black shadow-[8px_8px_0_rgba(255,255,255,0.15)] hover:border-black/35 hover:bg-white/85"
      : "border-white/20 bg-black/55 text-white shadow-[8px_8px_0_rgba(0,0,0,0.35)] hover:border-white/50 hover:bg-black/70"
  }`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
}

function SectionButton({
  active,
  label,
  accent,
  isLightMode,
  onClick,
}: {
  active: boolean;
  label: string;
  accent: string;
  isLightMode: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-target pointer-events-auto border-2 px-4 py-3 text-xs font-black uppercase tracking-[0.24em] transition-all duration-300 sm:text-sm xl:text-sm ${
        active
          ? isLightMode
            ? "border-black bg-[#fff7d6] text-black shadow-[5px_5px_0_#000]"
            : "border-black bg-white text-black shadow-[5px_5px_0_#000]"
          : isLightMode
            ? "border-black/15 bg-white/55 text-black/70 hover:border-black/40 hover:text-black"
            : "border-white/20 bg-black/45 text-white/72 hover:border-white/45 hover:text-white"
      }`}
      style={active ? { boxShadow: `5px 5px 0 ${accent}` } : undefined}
    >
      {label}
    </button>
  );
}

export default function CreditsPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("team");
  const [displaySection, setDisplaySection] = useState<SectionKey>("team");
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const { isLightMode } = useTheme();
  const switchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current);
      }
    };
  }, []);

  const handleSectionChange = (nextSection: SectionKey) => {
    if (nextSection === activeSection) {
      return;
    }

    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current);
    }

    setActiveSection(nextSection);
    setIsSectionVisible(false);
    switchTimerRef.current = window.setTimeout(() => {
      setDisplaySection(nextSection);
      setIsSectionVisible(true);
      switchTimerRef.current = null;
    }, 180);
  };

  const activeMeta =
    sectionOrder.find((section) => section.key === activeSection) ??
    sectionOrder[0];
  const displayMeta =
    sectionOrder.find((section) => section.key === displaySection) ??
    sectionOrder[0];
  const displayContent = sections[displayMeta.key];

  return (
    <div
      className={`relative min-h-screen font-sans selection:bg-[#ff00a0] selection:text-white transition-colors duration-500 ${isLightMode ? "bg-[#f5f5f5]" : "bg-black"}`}
    >
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-20 sm:px-6 lg:px-8 relative z-20">
        <div className="text-left w-full mx-auto relative z-20 pointer-events-auto pb-10">
          <header className="text-center">
            <p
              className={`cursor-target text-[10px] font-black uppercase tracking-[0.4em] ${isLightMode ? "text-black/55" : "text-white/50"}`}
            >
              Hack X 2.0
            </p>
            <h1
              className={`cursor-target text-center font-black uppercase tracking-tighter text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 ${isLightMode ? "text-black" : "text-white"}`}
            >
              Credits & Thanks
            </h1>
            <p
              className={`cursor-target text-center font-black uppercase tracking-widest text-sm mb-16 px-4 py-2 border-[3px] mx-auto w-fit ${isLightMode ? "border-black bg-[#ff00a0] text-white" : "border-[#ff00a0] bg-black text-[#ff00a0]"}`}
            >
              Team • Gratitude
            </p>
          </header>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {sectionOrder.map((section) => (
              <SectionButton
                key={section.key}
                active={section.key === activeSection}
                label={section.label}
                accent={section.accent}
                isLightMode={isLightMode}
                onClick={() => handleSectionChange(section.key)}
              />
            ))}
          </div>

          <section className="w-full">
            <div
              className={`cursor-target mb-10 border-[3px] p-6 sm:p-8 ${isLightMode ? "border-black bg-white shadow-[8px_8px_0_#000]" : "border-white/30 bg-[#111] shadow-[8px_8px_0_#fff]"}`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p
                    className={`cursor-target text-[10px] font-black uppercase tracking-[0.34em] ${isLightMode ? "text-black/50" : "text-white/55"}`}
                  >
                    Credits section
                  </p>
                  <h2
                    className={`cursor-target mt-3 font-black uppercase tracking-tighter text-4xl sm:text-5xl ${isLightMode ? "text-black" : "text-white"}`}
                  >
                    {displayContent.label}
                  </h2>
                </div>
                <span
                  className="cursor-target inline-flex w-fit border-[3px] border-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-black"
                  style={{ backgroundColor: displayMeta.accent }}
                >
                  {String(displayContent.cards.length).padStart(2, "0")} items
                </span>
              </div>
              <p
                className={`cursor-target mt-6 max-w-3xl text-sm sm:text-base font-bold leading-relaxed ${isLightMode ? "text-black/70" : "text-white/70"}`}
              >
                {displayContent.intro}
              </p>
            </div>

            <div
              className={`grid auto-rows-auto gap-6 ${displayContent.colClass} ${
                isSectionVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } transition-all duration-300`}
            >
              {displayContent.cards.map((card, index) => (
                <div
                  key={`${displayMeta.key}-${index}`}
                  className={`transition-all duration-500 ${
                    isSectionVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${isSectionVisible ? 80 + index * 70 : 0}ms` }}
                >
                  <InfoCard
                    {...card}
                    accent={displayMeta.accent}
                    isLightMode={isLightMode}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}