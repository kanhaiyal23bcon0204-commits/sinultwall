// src/app/components/Navbar.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "./ui/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const go = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/55 px-4 py-2.5 shadow-[0_12px_40px_-18px_rgba(80,60,160,0.45)] backdrop-blur-xl sm:px-5">
        <Logo onClick={() => setMobileOpen(false)} />

        <div className="hidden items-center gap-1 md:flex">
          <NavItem label="Home" active={location.pathname === "/"} onClick={() => go("/")} />
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 text-[var(--foreground)] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-2 shadow-xl backdrop-blur-2xl md:hidden"
          >
            <button 
              onClick={() => go("/")} 
              className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-[var(--secondary)]"
            >
              Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void; }) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "rounded-xl px-3.5 py-2 text-[0.95rem] font-medium transition-colors", 
        active ? "bg-white/70 text-[var(--primary)]" : "text-[var(--secondary-foreground)] hover:bg-white/70"
      )}
    >
      {label}
    </button>
  );
}