import { motion } from "motion/react";

const heights = [260, 340, 300, 380, 280, 360, 320, 300, 340];

export function CardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.4rem] border border-white/60 bg-white/70"
      style={{ height: heights[index % heights.length] }}
    >
      <Shimmer />
    </div>
  );
}

export function Shimmer() {
  return (
    <div className="absolute inset-0 bg-[var(--muted)]">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <motion.div
        className="h-12 w-12 rounded-full border-[3px] border-[var(--secondary)] border-t-[var(--primary)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
      <span className="text-sm font-medium text-[var(--muted-foreground)]">{label}…</span>
    </div>
  );
}
