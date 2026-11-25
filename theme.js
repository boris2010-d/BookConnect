/* Shared light/dark theme for both BookConnect pages. */
(function () {
  "use strict";
  const STORAGE_KEY = "bookconnect_theme";
  const root = document.documentElement;
  let saved = "light";
  try { saved = localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light"; }
  catch (_) { /* Storage may be disabled in private mode. */ }

  function updateButton() {
    const button = document.getElementById("themeToggle");
    if (!button) return;
    const isDark = root.dataset.theme === "dark";
    const english = root.lang === "en";
    const label = isDark
      ? (english ? "Light mode" : "Светъл режим")
      : (english ? "Dark mode" : "Тъмен режим");
    button.textContent = (isDark ? "☀ " : "☾ ") + label;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(isDark));
  }

  function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";
    root.dataset.theme = normalized;
    root.style.colorScheme = normalized;
    try { localStorage.setItem(STORAGE_KEY, normalized); }
    catch (_) { /* Theme still works for this page. */ }
    updateButton();
  }

  window.bookConnectTheme = { applyTheme, updateButton };
  applyTheme(saved);
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("themeToggle");
    if (button) button.addEventListener("click", () => {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
    updateButton();
  });
})();
