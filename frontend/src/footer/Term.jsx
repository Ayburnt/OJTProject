import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function FooterNav() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    help: false,
    CustomerSupport: false,
    Organizers: false,
    Legal: false,
  });

  const navRef = useRef();

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdownOpen({
          help: false,
          CustomerSupport: false,
          Organizers: false,
          Legal: false,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      key: "help",
      label: "Need Help?",
      links: ["How to buy tickets?", "Where are my tickets?", "How to use e-ticket?", "Help Center"]
    },
    { key: "CustomerSupport", label: "Customer Support", links: ["1", "2", "3"] },
    { key: "Organizers", label: "Event organizer", links: ["Our Solutions", "Pricing", "Contact Us"] },
    { key: "Legal", label: "Legal", links: ["Terms", "Policy", "Security"] },
  ];

  const dropdownClass =
    "absolute top-full left-1/2 mt-2 w-43 bg-white border border-transparent rounded-md shadow z-10 -translate-x-1/2 text-center";

  return (
    <header className="w-full bg-white shadow-sm" ref={navRef}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/sariLogo.png" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-8 items-center relative">
          {navItems.map((item) => (
            <div key={item.key} className="relative">
              <button
                className="flex items-center text-sm text-gray-700 font-medium gap-1"
                onClick={() => toggleDropdown(item.key)}
              >
                {item.label} <FiChevronDown />
              </button>

              {dropdownOpen[item.key] && (
                   <div className={dropdownClass}>
                  {item.links.map((link, i) => {
                if (link === "Terms") {
                  return (
                    <Link
                      key={i}
                      to="/terms"
                      className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      {link}
                    </Link>
                  );
                }
                if (link === "Policy") {
                  return (
                    <Link
                      key={i}
                      to="/policy"
                      className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      {link}
                    </Link>
                  );
                }
                  if (link === "Security") {
                  return (
                    <Link
                      key={i}
                      to="/security"
                      className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      {link}
                    </Link>
                  );
                }
                return (
                  <a
                    key={i}
                    href="#"
                    className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    {link}
                  </a>
                );
              })}

                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-2xl text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.key}>
              <button
                className="w-full flex justify-between items-center text-gray-700 text-sm"
                onClick={() => toggleDropdown(item.key)}
              >
                {item.label} <FiChevronDown />
              </button>
              {dropdownOpen[item.key] && (
                <div className="pl-4 mt-1 space-y-1 text-center w-43 bg-white border border-transparent rounded-md shadow z-10 -translate-x-1/2 relative left-1/2">
                  {item.links.map((link, i) => {
                    if (link === "Terms") {
                      return (
                        <Link
                          key={i}
                          to="/terms"
                          className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                        >
                          {link}
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={i}
                        href="#"
                        className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                      >
                        {link}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
