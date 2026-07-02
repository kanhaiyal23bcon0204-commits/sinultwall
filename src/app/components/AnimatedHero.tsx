// src/app/components/AnimatedHero.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search } from "lucide-react";

export function AnimatedHero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // ADDED: Navigate hook for routing

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // ADDED: User ko query ke sath search page par redirect karna
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl"
        >
          Discover Premium <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#ff8fc7]">
            Wallpapers
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-600"
        >
          Elevate your screens with our hand-curated collection of high-resolution wallpapers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <form onSubmit={handleSearch} className="relative flex items-center shadow-[0_12px_40px_-18px_rgba(80,60,160,0.3)] rounded-full">
            <Search className="absolute left-5 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for wallpapers..."
              className="w-full rounded-full border border-gray-300/80 bg-white/85 py-4 pl-14 pr-32 text-lg backdrop-blur-md transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
            <button
              type="submit"
              className="absolute right-2.5 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--primary)]/90"
            >
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}