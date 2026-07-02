// src/components/Logo.tsx
import { Link } from "react-router";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex items-center gap-3"
      aria-label="SinultWall home"
    >
      {/* Increased size slightly (h-10 w-10) for better visibility of the custom logo */}
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#ff8fc7] shadow-[0_8px_20px_-6px_rgba(124,92,255,0.6)] transition-transform duration-300 group-hover:scale-105">
        
        {/* Custom 'SW' Monogram SVG Logo */}
        <svg 
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Abstract 'S' on the left */}
          <path d="M10.5 7.5a2.5 2.5 0 1 0-5 0c0 4.5 7 2.5 7 7a2.5 2.5 0 1 1-5 0" />
          {/* Abstract 'W' on the right */}
          <path d="M13 7.5l2 9 2-5 2 5 2-9" />
        </svg>

      </span>
      <span className="text-[1.2rem] font-bold tracking-tight">
        Sinult<span className="text-[var(--primary)]">Wall</span>
      </span>
    </Link>
  );
}