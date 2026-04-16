"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CouponTearProps {
  mealLabel: string;
  onDismiss: () => void;
}

/* ─── Canvas confetti burst ───────────────────────────────────────────── */
function launchConfetti(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d")!;

  const colors = ["#c0ff00", "#ff00a0", "#00f0ff", "#ffd23f", "#ffffff"];
  const pieces = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height / 2 + (Math.random() - 0.5) * 80,
    vx: (Math.random() - 0.5) * 16,
    vy: -(Math.random() * 20 + 6),
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 14,
    w: Math.random() * 12 + 5,
    h: Math.random() * 6 + 3,
    alpha: 1,
  }));

  let frame = 0;
  const MAX = 130;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.6;
      p.vx *= 0.97;
      p.angle += p.spin;
      p.alpha = Math.max(0, 1 - frame / MAX);
    }
    frame++;
    if (frame < MAX) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

/* ─── Perforated centre line ──────────────────────────────────────────── */
function Perforation() {
  return (
    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center"
      style={{ width: 24 }}>
      <svg width="24" height="100%" className="w-full h-full overflow-visible">
        <line
          x1="12" y1="0" x2="12" y2="100%"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="2"
          strokeDasharray="8 6"
          strokeLinecap="round"
        />
        <text x="12" y="24" textAnchor="middle" fontSize="18"
          fill="rgba(255,255,255,0.9)" style={{ userSelect: "none" }}>✂</text>
      </svg>
    </div>
  );
}

export function CouponTear({ mealLabel, onDismiss }: CouponTearProps) {
  const [phase, setPhase] = useState<"idle" | "tearing" | "torn">("idle");
  const confettiRef = useRef<HTMLCanvasElement>(null);

  const THRESHOLD = 120; // px pull needed to tear

  // Drive animation with pure Framer Motion values for 60fps native feel
  const dragX = useMotionValue(0);
  const dragDistance = useTransform(dragX, (v) => Math.abs(v));
  
  // Left moves left, right moves right
  const leftX = useTransform(dragDistance, (v) => phase === "torn" ? -420 : -v);
  const rightX = useTransform(dragDistance, (v) => phase === "torn" ? 420 : v);
  const tearProgress = useTransform(dragDistance, (v) => Math.min(1, v / THRESHOLD));
  const progressWidth = useTransform(tearProgress, (v) => `${v * 100}%`);

  // Trigger state changes when drag crosses threshold
  useEffect(() => {
    return dragDistance.on("change", (v) => {
      if (phase === "torn") return;
      if (v > 0 && phase !== "tearing") setPhase("tearing");
      if (v === 0 && phase === "tearing") setPhase("idle");
    });
  }, [dragDistance, phase]);

  const completeTear = () => {
    setPhase("torn");
    if (confettiRef.current) launchConfetti(confettiRef.current);
    setTimeout(onDismiss, 3800);
  };

  const handleDragEnd = () => {
    if (dragDistance.get() >= THRESHOLD * 0.9) {
      completeTear();
    } else {
      // Snap back if released too early
      setPhase("idle");
    }
  };

  const LEFT_PCT = "74.5%";
  const RIGHT_PCT = "25.5%";

  return (
    <AnimatePresence>
      <motion.div
        key="coupon-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
        onClick={() => { if (phase === "torn") onDismiss(); }}
      >
        {/* Confetti canvas */}
        <canvas
          ref={confettiRef}
          className="pointer-events-none fixed inset-0 z-[10000]"
        />

        {/* Meal label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5 text-[11px] font-black uppercase tracking-[0.4em] text-white/55 select-none"
        >
          🍽️ &nbsp;{mealLabel} Collected
        </motion.p>

        {/* ── Coupon container ── */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.08 }}
          className="relative select-none"
          style={{ width: "min(88vw, 640px)" }}
        >
          {/* Invisible interactive drag overlay that drives everything */}
          {phase !== "torn" && (
            <motion.div
              className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -180, right: 180 }}
              dragElastic={0.1}
              style={{ x: dragX, touchAction: "none" }}
              onDragEnd={handleDragEnd}
            />
          )}

          {/* ── Left half ── */}
          <motion.div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: LEFT_PCT, height: "100%", x: leftX, zIndex: 30 }}
            animate={phase === "torn" ? { rotate: -10, opacity: 0 } : {}}
            transition={phase === "torn" ? { type: "spring", stiffness: 160, damping: 16 } : {}}
          >
            <img
              src="/coupon/CouponL.png"
              alt="HackX Ticket"
              className="w-full h-auto block"
              draggable={false}
              style={{ userSelect: "none", pointerEvents: "none" }}
            />
            {/* Tear shadow */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,1))", opacity: tearProgress }}
            />
          </motion.div>

          {/* Spacer so the wrapper has the exact document flow height */}
          <img
            src="/coupon/CouponL.png"
            alt=""
            aria-hidden
            className="w-full h-auto invisible block"
            draggable={false}
            style={{ pointerEvents: "none" }}
          />

          {/* ── Right half ── */}
          <motion.div
            className="absolute top-0 overflow-hidden"
            style={{ width: RIGHT_PCT, height: "100%", left: LEFT_PCT, x: rightX, zIndex: 30 }}
            animate={phase === "torn" ? { rotate: 10, opacity: 0 } : {}}
            transition={phase === "torn" ? { type: "spring", stiffness: 160, damping: 16 } : {}}
          >
            <img
              src="/coupon/CouponR.png"
              alt="Meal Coupon"
              className="w-full h-auto block"
              draggable={false}
              style={{ userSelect: "none", pointerEvents: "none" }}
            />
            {/* Tear shadow */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none"
              style={{ background: "linear-gradient(to left, transparent, rgba(0,0,0,1))", opacity: tearProgress }}
            />
          </motion.div>

          {/* Perforation line */}
          {phase !== "torn" && <Perforation />}
        </motion.div>

        {/* Progress bar */}
        {phase === "tearing" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-6 w-40 h-[2px] bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-[#c0ff00] rounded-full"
              style={{ width: progressWidth, transformOrigin: "left" }}
            />
          </motion.div>
        )}

        {/* Post-tear */}
        {phase === "torn" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <p className="text-5xl">🎉</p>
            <p className="text-[13px] font-black uppercase tracking-[0.3em] text-[#c0ff00]">
              Enjoy your meal!
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mt-1">
              Tap anywhere to close
            </p>
          </motion.div>
        )}

        {/* Idle hint */}
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <motion.p
              animate={{ x: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="text-[12px] font-black uppercase tracking-[0.3em] text-[#c0ff00] select-none text-center"
              style={{ textShadow: "0 0 10px rgba(192, 255, 0, 0.4)" }}
            >
              ← drag to tear →
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
