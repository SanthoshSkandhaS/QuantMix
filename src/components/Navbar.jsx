import React, { useState, useEffect } from "react";
import { Atom, Menu, X, PlayCircle, Sparkles, ExternalLink } from "lucide-react";

/**
 * Navbar
 * Features:
 * - QuantMix wordmark & quantum badge
 * - Smooth scroll navigation links
 * - Scroll progress indicator along the top edge
 * - Sticky blurred header with scroll elevation
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

      // Calculate progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollY / docHeight) * 100);
      }

      // Detect active section
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
          background: "linear-gradient(90deg, #35D6D0, #9B8CFF)",
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
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          backgroundColor: scrolled ? "rgba(11, 16, 32, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(169, 182, 207, 0.1)" : "1px solid transparent",
          padding: scrolled ? "12px 0" : "20px 0"
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
              gap: "12px",
              textDecoration: "none"
            }}
            aria-label="QuantMix Home"
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(53, 214, 208, 0.2), rgba(155, 140, 255, 0.25))",
                border: "1px solid rgba(53, 214, 208, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#35D6D0",
                boxShadow: "0 0 16px rgba(53, 214, 208, 0.25)"
              }}
            >
              <Atom size={22} className="spin-atomic" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text-main)"
                  }}
                >
                  QuantMix
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 7px",
                    borderRadius: "999px",
                    background: "rgba(155, 140, 255, 0.15)",
                    border: "1px solid rgba(155, 140, 255, 0.3)",
                    color: "var(--color-violet)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600
                  }}
                >
                  v1.0
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em"
                }}
              >
                Virtual Quantum Explorer
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: "8px"
            }}
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "0.92rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-teal)" : "var(--color-text-secondary)",
                    backgroundColor: isActive ? "rgba(53, 214, 208, 0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(53, 214, 208, 0.25)" : "1px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text-main)";
                      e.currentTarget.style.backgroundColor = "rgba(17, 27, 46, 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action Area: Replay Intro Button & Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={onReplayIntro}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "rgba(17, 27, 46, 0.7)",
                border: "1px solid rgba(155, 140, 255, 0.25)",
                color: "var(--color-text-secondary)",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-violet)";
                e.currentTarget.style.color = "var(--color-text-main)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(155, 140, 255, 0.25)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              title="Watch the 4-second atomic collision introductory animation again"
              aria-label="Replay Atomic Introduction Animation"
            >
              <PlayCircle size={15} color="var(--color-violet)" />
              <span className="replay-text">Replay Intro</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
              aria-expanded={mobileMenuOpen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(17, 27, 46, 0.8)",
                border: "1px solid var(--border-subtle)",
                color: "var(--color-text-main)",
                cursor: "pointer"
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(11, 16, 32, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            zIndex: 890,
            display: "flex",
            flexDirection: "column",
            padding: "32px 24px",
            gap: "16px"
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: activeSection === link.id ? "var(--color-teal)" : "var(--color-text-main)",
                padding: "12px 16px",
                borderRadius: "12px",
                background: activeSection === link.id ? "rgba(53, 214, 208, 0.1)" : "rgba(17, 27, 46, 0.5)",
                border: "1px solid rgba(169, 182, 207, 0.1)"
              }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(155, 140, 255, 0.12)",
                border: "1px solid rgba(155, 140, 255, 0.3)",
                color: "var(--color-text-main)",
                fontWeight: 600
              }}
            >
              <PlayCircle size={18} color="var(--color-violet)" />
              <span>Replay 4s Atomic Intro</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .replay-text {
            display: none;
          }
        }
        @keyframes spinAtomic {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-atomic {
          animation: spinAtomic 25s linear infinite;
        }
      `}</style>
    </>
  );
}
