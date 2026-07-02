import { useState } from 'react';

export default function Navbar() {
  // Mobile menu ke liye state
  const [isOpen, setIsOpen] = useState(false);
  // Desktop categories dropdown ke liye state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-900">
              SinultWall
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Home
            </a>
            
            {/* Device Categories Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-600 hover:text-gray-900 font-medium flex items-center transition"
              >
                Categories
                {/* Dropdown Arrow Icon */}
                <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu Items */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  <a 
                    href="/?category=desktop" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    Desktop Wallpapers
                  </a>
                  <a 
                    href="/?category=mobile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    Mobile Wallpapers
                  </a>
                </div>
              )}
            </div>

            <a href="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Contact
            </a>
            
            {/* Admin Button */}
            <a href="/admin" className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition">
              Admin
            </a>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  // Close (X) Icon
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Hamburger Menu Icon
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Responsive) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
              Home
            </a>
            
            {/* Mobile Device Categories */}
            <div className="px-3 py-2 text-base font-bold text-gray-900 border-b border-gray-100">
              Categories
            </div>
            <a href="/?category=desktop" className="block px-6 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
              🖥️ Desktop Wallpapers
            </a>
            <a href="/?category=mobile" className="block px-6 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
              📱 Mobile Wallpapers
            </a>
            
            <a href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
              Contact
            </a>
            <a href="/admin" className="block px-3 py-2 mt-4 text-center rounded-md text-base font-medium bg-black text-white hover:bg-gray-800" onClick={() => setIsOpen(false)}>
              Admin
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}