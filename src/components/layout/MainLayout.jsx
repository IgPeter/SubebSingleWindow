import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  ScaleIcon,
  PresentationChartLineIcon,
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import bglessLogo from "../../assets/images/bgless-subeb-logo.png";

const departments = [
  {
    title: "Academic Services",
    fullName: "Department of Academic Services",
    href: "/departments/academic-services",
    icon: AcademicCapIcon,
    submenu: [
      { title: "Sports Activities", href: "/sports" },
      { title: "Agricultural & Greening", href: "/agricultural-greening" },
    ],
  },
  {
    title: "Monitoring & Evaluation",
    fullName: "Department of Monitoring and Evaluation",
    href: "/departments/monitoring-evaluation",
    icon: MagnifyingGlassIcon,
    submenu: [
      { title: "Quality Assurance", href: "/quality-assurance" },
      { title: "Centralized Exams", href: "/centralized-exams" },
    ],
  },
  {
    title: "Administration & Supplies",
    fullName: "Department of Administration and Supplies",
    href: "/departments/administration-supplies",
    icon: TruckIcon,
    submenu: [
      { title: "Registry", href: "/registry" },
      { title: "Human Resource & People", href: "/human-resource" },
    ],
  },
  {
    title: "Social Mobilization",
    fullName: "Department of Social Mobilization",
    href: "/departments/social-mobilization",
    icon: UserGroupIcon,
    submenu: [{ title: "SBMC/Project Activities", href: "/sbmc-projects" }],
  },
  {
    title: "Teacher Development",
    fullName: "Department of Teacher Professional Development",
    href: "/departments/teacher-development",
    icon: PresentationChartLineIcon,
    submenu: [{ title: "Trainings", href: "/trainings" }],
  },
  {
    title: "Physical Planning",
    fullName: "Department of Physical Planning and Technical Services",
    href: "/departments/physical-planning",
    icon: WrenchScrewdriverIcon,
    submenu: [{ title: "Project Activities", href: "/physical-projects" }],
  },
  {
    title: "Finance & Accounts",
    fullName: "Department of Finance and Accounts",
    href: "/departments/finance-accounts",
    icon: BanknotesIcon,
  },
  {
    title: "Audit Department",
    fullName: "Audit Department",
    href: "/departments/audit",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Legal Services",
    fullName: "Department of Legal Services",
    href: "/departments/legal-services",
    icon: ScaleIcon,
  },
  {
    title: "Planning & Research",
    fullName: "Department of Planning, Research and Statistics",
    href: "/departments/planning-research",
    icon: PresentationChartLineIcon,
  },
];

const units = [
  { title: "Stores", href: "/units/stores" },
  { title: "Digital Resource Centre", href: "/units/digital-resource" },
  { title: "Special Programs", href: "/units/special-programs" },
  { title: "Procurement", href: "/units/procurement" },
];

function MainLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedDept, setExpandedDept] = useState(null);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser && typeof savedUser === "object") {
          // Normalize fullName: if it's an object {first, last}, convert to string
          if (savedUser.fullName && typeof savedUser.fullName === "object") {
            const { first = "", last = "" } = savedUser.fullName;
            savedUser.fullName = `${first} ${last}`.trim();
          }
          setUser(savedUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();
    // Listen for storage events (emitted by signin.jsx)
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setExpandedDept(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setExpandedDept(null); // Reset expansion when switching main dropdowns
  };

  const toggleDeptExpansion = (e, index) => {
    if (departments[index].submenu) {
      e.preventDefault();
      e.stopPropagation();
      setExpandedDept(expandedDept === index ? null : index);
    } else {
      setActiveDropdown(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-1.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <img
                    src={bglessLogo}
                    alt="SUBEB Logo"
                    className="h-10 w-auto"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#0c4a6e] leading-tight">
                    SUBEB
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 tracking-[0.25em] uppercase">
                    BBEMIS Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1.5"
              ref={dropdownRef}
            >
              {/* Departments Multi-Level Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("departments")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${activeDropdown === "departments" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Departments</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "departments" ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Level 2 Dropdown (Departments List) */}
                <div
                  className={`absolute top-full -left-48 mt-4 w-[900px] bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 transform origin-top ${activeDropdown === "departments" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
                >
                  <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                      {departments.map((dept, index) => (
                        <div key={index} className="h-fit">
                          <div className="mb-1">
                            <Link
                              to={dept.href}
                              onClick={(e) => toggleDeptExpansion(e, index)}
                              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${expandedDept === index ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-xl ${expandedDept === index ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-100 text-gray-500"}`}
                                >
                                  {dept.icon && (
                                    <dept.icon className="w-4 h-4" />
                                  )}
                                </div>
                                <span className="text-sm font-bold text-left leading-tight">
                                  {dept.title}
                                </span>
                              </div>
                              {dept.submenu && (
                                <ChevronRightIcon
                                  className={`w-4 h-4 transition-transform duration-300 ${expandedDept === index ? "rotate-90" : ""}`}
                                />
                              )}
                            </Link>

                            {/* Level 3 Dropdown (Sub-items) */}
                            {dept.submenu && (
                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedDept === index ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                              >
                                <div className="ml-12 border-l-2 border-blue-100 flex flex-col gap-1 py-1">
                                  {dept.submenu.map((sub, i) => (
                                    <Link
                                      key={i}
                                      to={sub.href}
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setExpandedDept(null);
                                      }}
                                      className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
                                    >
                                      {sub.title}
                                    </Link>
                                  ))}
                                  <Link
                                    to={dept.href}
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setExpandedDept(null);
                                    }}
                                    className="px-4 py-2 text-xs font-black text-blue-600 hover:translate-x-1 transition-all duration-200 mt-1"
                                  >
                                    View Full Dept Details →
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Optional: Mega Menu Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center px-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Select a department to view its specific services and
                        sub-units
                      </div>
                      <Link
                        to="/departments"
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
                      >
                        All Departments Overview{" "}
                        <ChevronRightIcon className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Units Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("units")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${activeDropdown === "units" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                  <span>Units</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "units" ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`absolute top-full left-0 mt-3 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 transition-all duration-300 transform origin-top ${activeDropdown === "units" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
                >
                  {units.map((unit, i) => (
                    <Link
                      key={i}
                      to={unit.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRightIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {unit.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/projects/brace-up"
                className="px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                BRACE-UP
              </Link>

              {/* HOPE-EDU */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("hope")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${activeDropdown === "hope" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  <span>HOPE-EDU</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "hope" ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`absolute top-full left-0 mt-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 transition-all duration-300 transform origin-top ${activeDropdown === "hope" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
                >
                  <Link
                    to="/hope-edu/budget"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Budget Planning
                  </Link>
                  <Link
                    to="/hope-edu/analytics"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Analytics Dashboard
                  </Link>
                </div>
              </div>

              <Link
                to="/about"
                className="px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                About
              </Link>

              <div className="ml-4 pl-4 border-l border-gray-200">
                {user ?
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-900">
                        {user.fullName}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                        {user?.role ? user.role.replace("_", " ") : ""}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 text-xs font-black rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                    >
                      Sign Out
                    </button>
                  </div>
                : <Link
                    to="/login"
                    className="px-7 py-3 bg-[#0c4a6e] text-white text-sm font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                  >
                    Sign In
                  </Link>
                }
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ?
                  <XMarkIcon className="w-8 h-8" />
                : <Bars3Icon className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-4 py-8 space-y-6 bg-white h-full overflow-y-auto">
            {/* Mobile Departments */}
            <div>
              <button
                onClick={() => toggleDropdown("mob-dept")}
                className={`flex items-center justify-between w-full text-lg font-black ${activeDropdown === "mob-dept" ? "text-blue-600" : "text-gray-900"}`}
              >
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-6 h-6" />
                  <span>Departments</span>
                </div>
                <ChevronDownIcon
                  className={`w-6 h-6 transition-transform ${activeDropdown === "mob-dept" ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${activeDropdown === "mob-dept" ? "max-h-[1000px] mt-6" : "max-h-0"}`}
              >
                <div className="space-y-4 ml-2 border-l-2 border-gray-100 pl-4">
                  {departments.map((dept, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Link
                          to={dept.href}
                          onClick={(e) => {
                            if (dept.submenu) {
                              e.preventDefault();
                              setExpandedDept(expandedDept === i ? null : i);
                            } else {
                              setIsMenuOpen(false);
                            }
                          }}
                          className="text-sm font-bold text-gray-700"
                        >
                          {dept.title}
                        </Link>
                        {dept.submenu && (
                          <button
                            onClick={() =>
                              setExpandedDept(expandedDept === i ? null : i)
                            }
                          >
                            <ChevronDownIcon
                              className={`w-5 h-5 text-gray-400 transition-transform ${expandedDept === i ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                      {dept.submenu && expandedDept === i && (
                        <div className="space-y-3 ml-4">
                          {dept.submenu.map((sub, si) => (
                            <Link
                              key={si}
                              to={sub.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-xs font-medium text-gray-500"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/units"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-lg font-black text-gray-900"
            >
              <Squares2X2Icon className="w-6 h-6" />
              Units
            </Link>

            <Link
              to="/projects/brace-up"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-lg font-black text-gray-900"
            >
              <ClipboardDocumentCheckIcon className="w-6 h-6" />
              BRACE-UP
            </Link>

            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-lg font-black text-gray-900"
            >
              <Squares2X2Icon className="w-6 h-6" />
              About
            </Link>

            <div className="pt-6">
              {user ?
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                      {typeof user.fullName === "string" ?
                        user.fullName[0]
                      : ""}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">
                        {user?.role ? user.role.replace("_", " ") : ""}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-6 py-4 bg-red-50 text-red-600 text-lg font-black rounded-2xl"
                  >
                    Sign Out
                  </button>
                </div>
              : <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-6 py-4 bg-blue-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-blue-100"
                >
                  Sign In to Portal
                </Link>
              }
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 font-medium">
            ∩⌐╜ {new Date().getFullYear()} State Universal Basic Education
            Board. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
