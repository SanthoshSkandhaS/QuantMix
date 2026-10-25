import React, { useMemo } from "react";
import katex from "katex";

/**
 * MathView Component
 * Renders LaTeX mathematical equations using KaTeX.
 *
 * Props:
 * - math: string (LaTeX string)
 * - display: boolean (true for block display equation, false for inline)
 * - className: string (optional extra classes)
 * - ariaLabel: string (optional accessible label)
 */
export default function MathView({ math, display = false, className = "", ariaLabel }) {
  const html = useMemo(() => {
    if (!math || typeof math !== "string") return "";
    try {
      return katex.renderToString(math.trim(), {
        displayMode: display,
        throwOnError: false,
        output: "htmlAndMathml",
        strict: false
      });
    } catch {
      // Fallback if KaTeX encounters unexpected syntax
      return `<code class="math-fallback">${escapeHtml(math)}</code>`;
    }
  }, [math, display]);

  if (!math) return null;

  if (display) {
    return (
      <div
        className={`math-view math-display ${className}`}
        aria-label={ariaLabel || `Mathematical formula: ${math}`}
        role="math"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-view math-inline ${className}`}
      aria-label={ariaLabel || math}
      role="math"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * MathText Component
 * Parses mixed text that may contain embedded LaTeX delimiters:
 * - Display: \[ ... \] or $$ ... $$
 * - Inline: \( ... \) or $ ... $ (with currency protection)
 *
 * Ordinary currency like "$100", "$50.00", or "$ 25" is safely preserved as text.
 */
export function MathText({ text, className = "" }) {
  const elements = useMemo(() => {
    if (!text || typeof text !== "string") return [];

    // Delimiter patterns:
    // 1. Display: \[ ... \] or $$ ... $$
    // 2. Inline: \( ... \)
    // 3. Inline dollar: $ ... $ (where content does not start/end with space and isn't currency)
    const regex = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\$(?!\s|\d)(?:\\.|[^$\\\n])+?(?<!\s|\$)\$)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index)
        });
      }

      const raw = match[0];
      if (raw.startsWith("\\[") && raw.endsWith("\\]")) {
        parts.push({
          type: "display",
          content: raw.slice(2, -2)
        });
      } else if (raw.startsWith("$$") && raw.endsWith("$$")) {
        parts.push({
          type: "display",
          content: raw.slice(2, -2)
        });
      } else if (raw.startsWith("\\(") && raw.endsWith("\\)")) {
        parts.push({
          type: "inline",
          content: raw.slice(2, -2)
        });
      } else if (raw.startsWith("$") && raw.endsWith("$")) {
        parts.push({
          type: "inline",
          content: raw.slice(1, -1)
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex)
      });
    }

    return parts;
  }, [text]);

  if (!text) return null;

  return (
    <span className={`math-text-wrapper ${className}`}>
      {elements.map((part, index) => {
        if (part.type === "display") {
          return <MathView key={index} math={part.content} display />;
        }
        if (part.type === "inline") {
          return <MathView key={index} math={part.content} inline />;
        }
        return <span key={index}>{part.content}</span>;
      })}
    </span>
  );
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
