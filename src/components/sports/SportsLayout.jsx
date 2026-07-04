// components/Sports/SportsLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import bglessLogo from "../../assets/images/bgless-subeb-logo.png";

export default function SportsLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for authenticated user
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser && typeof savedUser === "object") {
        // Normalize fullName: if it's an object {first, last}, convert to string
        if (savedUser.fullName && typeof savedUser.fullName === "object") {
          const { first = "", last = "" } = savedUser.fullName;
          savedUser.fullName = `${first} ${last}`.trim();
        }
        setUser(savedUser);
      }
    } catch {
      // Handle parse error silently
    }
  }, []);

  // Check if we are on the summary page
  const isSummaryPage =
    location.pathname.includes("/register/summary") ||
    location.pathname.includes("/registration/summary");

  const navLinks = [
    { name: "Home", path: "/sports" },
    { name: "Upcoming Events", path: "/sports" }, // Updated to use Home's event section or similar
  ];

  // Add Check Registration link only if user is NOT state_admin
  if (user?.role !== "state_admin") {
    navLinks.push({ name: "Check Registration", path: "/sports/lookup" });
  }

  // Add Admin link if user is state_admin
  if (user?.role === "state_admin") {
    navLinks.push({ name: "Admin Panel", path: "/sports/admin" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sports Header - Hide on summary page and during print */}
      {!isSummaryPage && (
        <header className="bg-[#1e3a8a] text-white shadow-lg print:hidden">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <img src={bglessLogo} alt="SUBEB" className="h-12 w-12" />
              <div>
                <span className="text-3xl font-bold tracking-tight text-white">
                  SUBEB
                </span>
                <span className="block text-blue-200 text-sm -mt-1">
                  Sports Platform
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={`${link.name}-${link.path}`}
                  to={link.path}
                  className={`text-white hover:text-blue-200 transition-colors pb-1 
                    ${
                      location.pathname === link.path ?
                        "underline decoration-2 decoration-white"
                      : ""
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-5 py-2 bg-white text-[#1e3a8a] rounded-xl font-semibold hover:bg-blue-100 transition"
              >
                Back to BBEMIS
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden text-3xl text-white"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileOpen && (
            <div className="md:hidden bg-[#1e3a8a] px-6 py-4 border-t border-blue-800">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="block py-3 text-lg text-white border-b border-blue-700 last:border-none hover:text-blue-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </header>
      )}

      <Outlet />
    </div>
  );
}
