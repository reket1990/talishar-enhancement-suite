// Content script: inject CSS rules that persist across React re-renders.
const STYLE_ID = "tes-injected-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* Hide "Support Us!" button in the header (NavLink to /premium). */
    nav li:has(> a[href="/premium"]) { display: none !important; }

    /* Hide "Support us on Metafy" buttons wherever they appear. */
    a[href*="metafy.gg"] { display: none !important; }
  `;
  (document.head || document.documentElement).appendChild(style);
}

injectStyles();
