import React, { useState, useEffect } from "react";
import { Atom, Menu, X, PlayCircle } from "lucide-react";

/**
 * Navbar
 * Features:
 * - Editorial wordmark & quantum badge
 * - Smooth scroll navigation links
 * - Scroll progress indicator along top edge
 * - Sticky blurred header with deep ink elevation
 * - "Replay Intro" trigger
 * - Mobile responsive drawer
 */
export default function Navbar({ onReplayIntro }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollY / docHeight) * 100);
      }

      const sections = ["hero", "discovery", "environments", "lab", "quanti"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Overview", href: "#hero", id: "hero" },
    { label: "Discovery", href: "#discovery", id: "discovery" },
    { label: "Environments", href: "#environments", id: "environments" },
    { label: "Quantum Lab", href: "#lab", id: "lab" },
    { label: "QuAntI AI", href: "#quanti", id: "quanti" }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Scroll Progress Line */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #C67248, #20C4B4)",
          zIndex: 1000,
          transition: "width 0.1s linear"
        }}
        aria-hidden="true"
      />

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          transition: "all 0.25s ease-out",
          backgroundColor: scrolled ? "rgba(11, 13, 17, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
          padding: scrolled ? "14px 0" : "22px 0"
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo / Wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none"
            }}
            aria-label="QuantMix Home"
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(24, 28, 38, 0.95)",
                border: "1px solid var(--border-stone)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-copper)"
              }}
            >
              <Atom size={19} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--color-text-main)",
                letterSpacing: "-0.02em"
              }}
            >
              QuantMix
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: "28px"
            }}
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 500,
                  color: activeSection === link.id ? "var(--color-copper)" : "var(--color-text-secondary)",
                  position: "relative",
                  transition: "color 0.2s ease",
                  padding: "4px 0"
                }}
                className={`nav-link-item ${activeSection === link.id ? "active" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={onReplayIntro}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                background: "rgba(24, 28, 38, 0.85)",
                border: "1px solid var(--border-stone)",
                color: "var(--color-text-main)",
                fontSize: "0.82rem",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)"
              }}
              className="replay-intro-btn"
              title="Replay the cinematic quantum intro"
            >
              <PlayCircle size={15} color="var(--color-copper)" />
              <span>Intro</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                background: "rgba(24, 28, 38, 0.9)",
                border: "1px solid var(--border-stone)",
                color: "var(--color-text-main)"
              }}
              className="mobile-toggle-btn"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "#12151D",
              borderTop: "1px solid var(--border-stone)",
              borderBottom: "1px solid var(--border-stone)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: activeSection === link.id ? "var(--color-copper)" : "var(--color-text-main)",
                  padding: "6px 0"
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
        }

        .nav-link-item:hover {
          color: var(--color-copper) !important;
        }

        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-copper);
          border-radius: 2px;
        }

        .replay-intro-btn:hover {
          background: rgba(32, 38, 52, 0.95) !important;
          border-color: var(--color-copper) !important;
        }
      `}</style>
    </>
  );
}
