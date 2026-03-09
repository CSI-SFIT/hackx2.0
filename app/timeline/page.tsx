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
  .bg-grid-light {
    background-size: 50px 50px;
    background-image: 
      linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  }
  .bg-grid-dark {
    background-size: 50px 50px;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
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
      className={`pointer-events-auto group relative flex h-14 w-14 items-center justify-center border-[3px] transition-all duration-300 hover:scale-105 active:scale-95 ${isLightMode
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

export default function TimelinePage() {
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

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-20 sm:px-6 lg:px-8 relative z-20">
          <div className="text-left w-full mx-auto relative z-20 pointer-events-auto pb-10">
            <h2
              className={`font-black uppercase tracking-tighter text-5xl sm:text-7xl text-center mb-16 ${isLightMode ? "text-black" : "text-white"}`}
            >
              Timeline
            </h2>

            <div className="mt-16 flex flex-col gap-8 max-w-5xl mx-auto">
              <div className="relative flex w-full items-center justify-center p-2 sm:p-4 perspective-1000">
                <img
                  src="/timeline_images/day1_title.webp"
                  alt="Day 1 Title"
                  className="max-w-md w-full object-contain pointer-events-none drop-shadow-md mx-auto"
                  draggable={false}
                />
              </div>

              <div className={`cursor-target group relative flex w-full items-center justify-center p-2 sm:p-4 transition-colors duration-300 hover:bg-purple-600 border-[3px] ${isLightMode ? "border-black bg-white shadow-[4px_4px_0_#000]" : "border-white/30 bg-[#111] shadow-[4px_4px_0_#fff]"}`}>
                <img
                  src="/timeline_images/day1schedule.webp"
                  alt="Day 1 Schedule"
                  className="w-full object-contain pointer-events-none drop-shadow-md"
                  draggable={false}
                />
              </div>

              <div className="relative flex w-full items-center justify-center p-2 sm:p-4 perspective-1000">
                <img
                  src="/timeline_images/day2_title.webp"
                  alt="Day 2 Title"
                  className="max-w-md w-full object-contain pointer-events-none drop-shadow-md mx-auto"
                  draggable={false}
                />
              </div>

              <div className={`cursor-target group relative flex w-full items-center justify-center p-2 sm:p-4 transition-colors duration-300 hover:bg-purple-600 border-[3px] ${isLightMode ? "border-black bg-white shadow-[4px_4px_0_#000]" : "border-white/30 bg-[#111] shadow-[4px_4px_0_#fff]"}`}>
                <img
                  src="/timeline_images/day2schedule.webp"
                  alt="Day 2 Schedule"
                  className="w-full object-contain pointer-events-none drop-shadow-md"
                  draggable={false}
                />
              </div>
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
