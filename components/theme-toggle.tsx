"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme ?? (systemDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";

    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (for example in private mode). The toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
    >
      <Moon aria-hidden="true" className="theme-icon-moon size-4" />
      <Sun aria-hidden="true" className="theme-icon-sun size-4" />
    </button>
  );
}
