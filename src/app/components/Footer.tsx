// src/app/components/ui/Footer.tsx
import { Link } from "react-router";
import { Logo } from "./Logo"; // Naya Logo component import kiya

export function Footer() {
  return (
    <footer className="w-full bg-[#f8f9fc] py-12 px-6 md:px-12 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand and Description */}
        <div className="max-w-sm">
          {/* Purane hardcoded design ko hatakar yahan <Logo /> component laga diya */}
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium wallpapers for every screen. Curated, high-resolution, and free to download.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-16">
          {/* Browse Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-900 mb-1">Browse</h3>
            <Link to="/wallpapers/mobile" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">Mobile</Link>
            <Link to="/wallpapers/laptop" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">Laptop</Link>
            <Link to="/wallpapers/desktop" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">Desktop</Link>
            <Link to="/wallpapers/tablet" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">Tablet</Link>
          </div>

          {/* About Links (Licensing Removed) */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-900 mb-1">About</h3>
            <Link to="/about" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">About Us</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">Privacy Policy</Link>
            <Link to="/contact" className="text-gray-500 hover:text-[#7c5cff] transition-colors text-sm">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}