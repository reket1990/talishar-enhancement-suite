// Content script: inject CSS rules gated by the popup's enable toggle.
const STYLE_ID = "tes-injected-styles";
const CSS = `
  /* Hide "Support Us!" button in the header (NavLink to /premium). */
  nav li:has(> a[href="/premium"]) { display: none !important; }

  /* Hide "Support us on Metafy" buttons wherever they appear. */
  a[href*="metafy.gg"] { display: none !important; }
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);
}

function removeStyles() {
  document.getElementById(STYLE_ID)?.remove();
}

// Fast path: assume enabled (the default). Verify against storage next tick
// and remove styles if the user has toggled the suite off.
injectStyles();
chrome.storage.local.get("enabled").then(({ enabled = true }) => {
  if (!enabled) removeStyles();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !("enabled" in changes)) return;
  if (changes.enabled.newValue === false) removeStyles();
  else injectStyles();
});
