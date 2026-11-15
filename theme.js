const STORAGE_KEY = "astronaut-jr-theme";
const root = document.documentElement;
const button = document.getElementById("btnTheme");

function applyTheme(theme, persist = false) {
  const isDark = theme === "dark";
  root.dataset.theme = isDark ? "dark" : "light";
  root.style.colorScheme = isDark ? "dark" : "light";

  document.querySelectorAll("[data-theme-choice]").forEach(choice => {
    const selected = choice.dataset.themeChoice === (isDark ? "dark" : "light");
    choice.classList.toggle("on", selected);
    choice.setAttribute("aria-pressed", String(selected));
  });

  if (button) {
    button.textContent = isDark ? "☀️" : "🌙";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = isDark ? "#101a32" : "#e7f6ff";

  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light"); } catch (_) {}
  }
}

let initialTheme = "light";
try { initialTheme = localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light"; } catch (_) {}
applyTheme(initialTheme);

button?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
});

document.addEventListener("click", event => {
  const choice = event.target.closest?.("[data-theme-choice]");
  if (choice) applyTheme(choice.dataset.themeChoice, true);
});

window.AstroTheme = {
  get: () => root.dataset.theme === "dark" ? "dark" : "light",
  set: theme => applyTheme(theme === "dark" ? "dark" : "light", true),
  toggle: () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true)
};
