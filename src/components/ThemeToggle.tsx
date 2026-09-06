import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

const THEME_STORAGE_KEY = "daniel-meng-theme";
const THEME_COLORS: Record<Theme, string> = {
  light: "#f8f7f4",
  dark: "#171915",
};

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function getNextPreference(
  preference: ThemePreference,
  systemTheme: Theme,
): ThemePreference {
  if (preference === "system") {
    return systemTheme === "light" ? "dark" : "light";
  }

  return preference === systemTheme ? "system" : systemTheme;
}

export default function ThemeToggle() {
  const [preference, setPreference] =
    useState<ThemePreference>(getStoredPreference);
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const resolvedTheme = preference === "system" ? systemTheme : preference;
  const nextPreference = getNextPreference(preference, systemTheme);

  useEffect(() => {
    const systemPreference = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const handleSystemChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    systemPreference.addEventListener("change", handleSystemChange);
    return () =>
      systemPreference.removeEventListener("change", handleSystemChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      setPreference(
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : "system",
      );
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolvedTheme;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[resolvedTheme]);

    try {
      if (preference === "system") {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    } catch {
      // The active theme still works when storage is unavailable.
    }
  }, [preference, resolvedTheme]);

  const label =
    preference === "system"
      ? `System (${resolvedTheme})`
      : preference === "dark"
        ? "Dark"
        : "Light";
  const nextLabel =
    nextPreference === "system"
      ? "system theme"
      : `${nextPreference} theme`;
  const ThemeIcon =
    preference === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Theme: ${label}. Switch to ${nextLabel}.`}
      title={`Theme: ${label} · Next: ${nextLabel}`}
      onClick={() => setPreference(nextPreference)}
    >
      <ThemeIcon size={15} aria-hidden="true" />
      <span>{preference === "system" ? "Auto" : label}</span>
    </button>
  );
}
