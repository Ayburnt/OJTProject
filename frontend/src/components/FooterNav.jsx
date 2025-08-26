import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

function FooterNav() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { key: "help", label: "Need Help", links: ["How to buy tickets?", "Where are my tickets?", "How to use e-ticket?", "Help Center"] },
    { key: "CustomerSupport", label: "Customer Support", links: ["Customer Support"] },
    { key: "Organizers", label: "Event organizer", links: ["Our Solutions", "Pricing", "Contact Us"] },
    { key: "Legal", label: "Legal", links: ["Term", "Policy", "Security"] },
  ];

  const dropdownClass = "absolute top-full left-1/2 mt-2 w-43 bg-white border border-transparent rounded-md shadow z-10 -translate-x-1/2 text-center";

  return (
    <header className="w-full bg-white shadow-sm relative" ref={navRef}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="cursor-pointer">
            <img src="/sariLogo.png" alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-8 items-center relative font-outfit">
        {navItems.map((item) => (
  <div key={item.key} className="relative">
    {/* Desktop */}
    {item.key === "CustomerSupport" ? (
      <Link
        to="/customer-support"
        className="text-sm text-gray-700 font-medium cursor-pointer"
      >
        {item.label}
      </Link>
    ) : (
      <button
        className="flex items-center text-sm text-gray-700 font-medium gap-1 cursor-pointer"
        onClick={() =>
          setOpenDropdown(openDropdown === item.key ? null : item.key)
        }
      >
        {item.label}
        <FiChevronDown />
      </button>
    )}

    {item.links && item.key !== "CustomerSupport" && openDropdown === item.key && (
      <div className={dropdownClass}>
        {item.links.map((link, i) => {
          if (link === "How to buy tickets?") {
            return (
              <Link
                key={i}
                to="/q1"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          if (link === "Where are my tickets?") {
            return (
              <Link
                key={i}
                to="/q2"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          if (link === "How to use e-ticket?") {
            return (
              <Link
                key={i}
                to="/q3"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          if (link === "Help Center") {
            return (
              <Link
                key={i}
                to="/help-center"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          if (link === "Pricing") {
            return (
              <Link
                key={i}
                to="/pricing"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          if (link === "Contact Us") {
            return (
              <Link
                key={i}
                to="/contact-us"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          if (link === "Term") {
            return (
              <Link
                key={i}
                to="/term"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
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
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
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
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {link}
              </Link>
            );
          }
          return (
            <Link
              key={i}
              to="#"
              className="block px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm cursor-pointer"
            >
              {link}
            </Link>
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
        <>
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={() => setOpen(false)}
          ></div>

          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-full z-20 bg-white border border-gray-300 w-[95%] rounded-lg shadow-md">
            <div className="max-w-md mx-auto px-4 pb-4 pt-4 space-y-2 font-outfit">
              {navItems.map((item) => (
                <div key={item.key}>
                  <button
                    className="w-full flex justify-between items-center text-gray-700 text-sm cursor-pointer"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.key ? null : item.key
                      )
                    }
                  >
                    {item.label}
                    {item.key !== "CustomerSupport" && <FiChevronDown />}
                  </button>

                  {item.links && openDropdown === item.key && (
                    <div className="pl-4 mt-1 space-y-1 w-full bg-white border border-transparent rounded-md shadow">
                      {item.links.map((link, i) => (
                        <Link
                          key={i}
                          to="#"
                          className="block px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default FooterNav;
