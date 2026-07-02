import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

export function StatisticsCard({
  label,
  value,
  icon: Icon,
  accent,
  index = 0,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/65 p-5 shadow-[0_20px_50px_-30px_rgba(80,60,160,0.5)] backdrop-blur-xl"
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div
        className="grid h-11 w-11 place-items-center rounded-2xl text-white"
        style={{ background: accent }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</div>
    </motion.div>
  );
}
