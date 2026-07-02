import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, Monitor, Smartphone, Tablet, Laptop } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "./ui/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const go = (path: string) => {
    setMobileOpen(false);
    setCategoryOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/55 px-4 py-2.5 shadow-[0_12px_40px_-18px_rgba(80,60,160,0.45)] backdrop-blur-xl sm:px-5">
        <Logo onClick={() => go("/")} />

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 md:flex">
          <NavItem label="Home" active={location.pathname === "/"} onClick={() => go("/")} />
          
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={cn(
                "flex items-center gap-1 rounded-xl px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                categoryOpen ? "bg-white/70 text-[var(--primary)]" : "text-[var(--secondary-foreground)] hover:bg-white/70"
              )}
            >
              {/* Text changed from "Device Categories" to "Devices" */}
              Devices
              <ChevronDown className={cn("h-4 w-4 transition-transform", categoryOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-2 shadow-xl backdrop-blur-2xl"
                >
                  <button onClick={() => go("/wallpapers/desktop")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/70 transition-colors">
                    <Monitor className="h-4 w-4" /> Desktop
                  </button>
                  <button onClick={() => go("/wallpapers/laptop")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/70 transition-colors">
                    <Laptop className="h-4 w-4" /> Laptop
                  </button>
                  <button onClick={() => go("/wallpapers/tablet")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/70 transition-colors">
                    <Tablet className="h-4 w-4" /> Tablet
                  </button>
                  <button onClick={() => go("/wallpapers/mobile")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/70 transition-colors">
                    <Smartphone className="h-4 w-4" /> Mobile
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 text-[var(--foreground)] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-2 shadow-xl backdrop-blur-2xl md:hidden"
          >
            <button onClick={() => go("/")} className="block w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-[var(--secondary)]">
              Home
            </button>
            
            {/* Text changed from "Device Categories" to "Devices" */}
            <div className="mt-4 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Devices
            </div>
            
            <button onClick={() => go("/wallpapers/desktop")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium hover:bg-[var(--secondary)] transition-colors">
              <Monitor className="h-5 w-5" /> Desktop
            </button>
            <button onClick={() => go("/wallpapers/laptop")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium hover:bg-[var(--secondary)] transition-colors">
              <Laptop className="h-5 w-5" /> Laptop
            </button>
            <button onClick={() => go("/wallpapers/tablet")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium hover:bg-[var(--secondary)] transition-colors">
              <Tablet className="h-5 w-5" /> Tablet
            </button>
            <button onClick={() => go("/wallpapers/mobile")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium hover:bg-[var(--secondary)] transition-colors">
              <Smartphone className="h-5 w-5" /> Mobile
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