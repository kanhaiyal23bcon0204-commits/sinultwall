import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { SortFilter, SORT_LABELS } from "../../lib/types";
import { cn } from "./ui/utils";

const OPTIONS: SortFilter[] = ["latest", "trending", "most_downloaded"];

export function FilterDropdown({
  value,
  onChange,
}: {
  value: SortFilter;
  onChange: (v: SortFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm font-medium shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80"
      >
        <SlidersHorizontal className="h-4 w-4 text-[var(--primary)]" />
        {SORT_LABELS[value]}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-white/50 bg-white/85 p-1.5 shadow-[0_24px_60px_-20px_rgba(80,60,160,0.5)] backdrop-blur-2xl"
          >
            {OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[var(--secondary)]",
                  value === o && "text-[var(--primary)]",
                )}
              >
                {SORT_LABELS[o]}
                {value === o && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
