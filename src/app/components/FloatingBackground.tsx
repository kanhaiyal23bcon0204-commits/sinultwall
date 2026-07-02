import { motion } from "motion/react";

/** Soft animated pastel gradient blobs that drift behind all content. */
export function FloatingBackground() {
  const blobs = [
    { c: "from-[#bca7ff] to-[#7c5cff]", x: "-10%", y: "-8%", s: 520, dur: 18 },
    { c: "from-[#ffc2e2] to-[#ff8fc7]", x: "70%", y: "0%", s: 460, dur: 22 },
    { c: "from-[#a7e0ff] to-[#74b9ff]", x: "20%", y: "55%", s: 560, dur: 26 },
    { c: "from-[#d9c8ff] to-[#b18bff]", x: "78%", y: "60%", s: 420, dur: 20 },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${b.c} opacity-40 blur-3xl`}
          style={{ width: b.s, height: b.s, left: b.x, top: b.y }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,rgba(251,250,255,0.55))]" />
    </div>
  );
}
