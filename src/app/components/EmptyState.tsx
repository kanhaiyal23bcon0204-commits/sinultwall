import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { ReactNode } from "react";

export function EmptyState({
  title = "Nothing here yet",
  description = "There are no wallpapers to show right now. Check back soon.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-3xl border border-white/50 bg-white/55 px-8 py-16 text-center backdrop-blur-xl"
    >
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] text-[var(--primary)]">
        <ImageOff className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      {action}
    </motion.div>
  );
}
