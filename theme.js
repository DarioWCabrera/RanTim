// Runs synchronously before CSS: no network calls or authentication state.
(() => {
  const storageKey = 'rantim-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const readPreference = () => {
    try {
      const value = localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch { return null; }
  };
  let preference = readPreference();
  const apply = () => {
    const theme = preference || (system.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1422' : '#ffffff');
    const button = document.querySelector('.landing-theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('title', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
  };
  apply();
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) { preference = readPreference(); apply(); }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.landing-theme-toggle');
    if (!button) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(storageKey, preference); } catch { /* Keep the selection for this page if storage is unavailable. */ }
      apply();
    });
    apply();
  });
})();