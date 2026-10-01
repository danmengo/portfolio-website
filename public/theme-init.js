// Loaded synchronously in <head> so the saved theme applies before first paint.
// Kept as an external file so the Content-Security-Policy can forbid inline scripts.
(() => {
  const storageKey = "daniel-meng-theme";
  let preference = "system";

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") preference = stored;
  } catch {
    // System preference remains the fallback when storage is unavailable.
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  const theme = preference === "system" ? systemTheme : preference;
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#171915" : "#f8f7f4");
})();
