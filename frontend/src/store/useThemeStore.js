import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  theme: (() => {
    // Check localStorage first, then system preference, default to light
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;

      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  })(),

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";

      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("theme", newTheme);

        // Apply theme to document
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      return { theme: newTheme };
    });
  },

  // Initialize theme on app load
  initializeTheme: () => {
    const { theme } = get();
    if (typeof window !== 'undefined') {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }
}));