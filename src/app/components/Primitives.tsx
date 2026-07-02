import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "./ui/utils";

interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "glass" | "ghost";
  size?: "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function GradientButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  disabled,
}: BtnProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-shadow disabled:opacity-50 disabled:pointer-events-none";
  const sizes = { md: "px-5 py-2.5 text-[0.95rem]", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary:
      "text-white bg-gradient-to-r from-[#7c5cff] to-[#a06bff] shadow-[0_12px_30px_-10px_rgba(124,92,255,0.7)] hover:shadow-[0_16px_38px_-10px_rgba(124,92,255,0.8)]",
    glass:
      "text-[var(--foreground)] bg-white/60 border border-white/60 backdrop-blur-xl shadow-[0_10px_30px_-14px_rgba(80,60,160,0.4)] hover:bg-white/80",
    ghost: "text-[var(--secondary-foreground)] hover:bg-white/70",
  };
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </motion.button>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/50 bg-white/60 shadow-[0_24px_60px_-30px_rgba(80,60,160,0.5)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium text-[var(--secondary-foreground)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </span>
  );
}
