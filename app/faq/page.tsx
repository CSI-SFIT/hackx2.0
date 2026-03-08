"use client";

import { WaveTiles } from "@/ui/components/basic/wave-tiles";
import { useState } from "react";

const STYLES = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes float-reverse {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(15px) rotate(-2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .text-outline-light {
    -webkit-text-stroke: 2px black;
    color: transparent;
  }
  .text-outline-dark {
    -webkit-text-stroke: 2px white;
    color: transparent;
  }
`;

const ThemeToggle = ({
  isLightMode,
  toggle,
}: {
  isLightMode: boolean;
  toggle: () => void;
}) => {
  return (
    <button
      onClick={toggle}
      className={`pointer-events-auto group relative flex h-14 w-14 items-center justify-center border-[3px] transition-all duration-300 hover:scale-105 active:scale-95 ${
        isLightMode
          ? "border-black bg-white shadow-[4px_4px_0_#000]"
          : "border-white bg-[#111] shadow-[4px_4px_0_#fff]"
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`relative h-8 w-8 transition-transform duration-500 ${isLightMode ? "rotate-0" : "rotate-360"}`}
      >
        {isLightMode ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full text-[#ff00a0]"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full text-[#c0ff00]"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default function FAQPage() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [forceTheme, setForceTheme] = useState(false);

  return (
    <div
      className={`relative min-h-screen font-sans selection:bg-[#ff00a0] selection:text-white transition-colors duration-500 ${isLightMode ? "bg-[#f5f5f5]" : "bg-black"}`}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <WaveTiles
          className={isLightMode ? "opacity-40" : "opacity-30"}
          onModeChange={setIsLightMode}
          trackPointerGlobally={true}
          forceTheme={forceTheme}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}

        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-20 sm:px-6 lg:px-8 relative z-20">
          <div className="text-left w-full mx-auto relative z-20 pointer-events-auto pb-10">
            <h2
              className={`font-black uppercase tracking-tighter text-5xl sm:text-7xl text-center mb-16 ${isLightMode ? "text-black" : "text-white"}`}
            >
              FAQ
            </h2>

            <div className="flex flex-col gap-6">
              {[
                {
                  q: "What is HackX 2.0?",
                  a: "HackX 2.0 is a 24-hour national-level hackathon aimed at solving real-world challenges to shape the future of Digital Bharat. It brings together over 10,000 developers, designers, and innovators.",
                },
                {
                  q: "Who can participate?",
                  a: "Any student enrolled in a recognized university or college can participate. Whether you are a first-year student or a final-year expert, you are welcome to build with us!",
                },
                {
                  q: "What is the team size?",
                  a: "Teams can have 2 to 4 members. You can either form a team beforehand or find teammates during the registration phase.",
                },
                {
                  q: "Is there a registration fee?",
                  a: "Details regarding the registration fee and process are updated on the registration portal. Check out the portal for the most recent timeline and fees!",
                },
                {
                  q: "Will the problem statements be given in advance?",
                  a: "The broad domains (Cyber Defence, FinTech, Smart Cities, Future Mobility) are known, but the exact problem statements are revealed during the opening ceremony to maintain equal footing.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className={`cursor-target group border-[3px] [&_summary::-webkit-details-marker]:hidden ${
                    isLightMode
                      ? "border-black bg-white shadow-[4px_4px_0_#000]"
                      : "border-white/30 bg-[#111] shadow-[4px_4px_0_#fff]"
                  }`}
                >
                  <summary
                    className={`flex cursor-pointer items-center justify-between p-6 font-black uppercase tracking-wide text-lg sm:text-xl focus:outline-none ${isLightMode ? "text-black" : "text-white"}`}
                  >
                    {faq.q}
                    <span
                      className={`ml-4 text-2xl transition-transform duration-300 group-open:rotate-45 ${isLightMode ? "text-[#ff00a0]" : "text-[#c0ff00]"}`}
                    >
                      +
                    </span>
                  </summary>
                  <div
                    className={`px-6 pb-6 font-bold leading-relaxed border-t-[3px] mt-2 pt-4 ${isLightMode ? "text-black/80 border-black/10" : "text-white/80 border-white/10"}`}
                  >
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-50 pointer-events-auto w-full border-t-[3px] py-12 px-6 sm:px-12 mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-500 border-black/20 bg-black/5 backdrop-blur-sm">
          <div
            className={`text-2xl font-black uppercase tracking-tighter ${isLightMode ? "text-black" : "text-white"}`}
          >
            HACKX <span className="text-[#ff00a0]">2.0</span>
          </div>
          <div
            className={`text-sm font-bold uppercase tracking-widest ${isLightMode ? "text-black/60" : "text-white/60"}`}
          >
            By CSI and GDG at SFIT • 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
