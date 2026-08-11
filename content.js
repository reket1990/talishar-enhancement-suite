// Content script (isolated world): injects CSS and mirrors the enable state
// onto a <html> dataset attribute so page-hook.js (MAIN world) can respect it.
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

function setEnabledMarker(enabled) {
  document.documentElement.dataset.tesEnabled = enabled ? "true" : "false";
}

// Optimistic default: enabled. Adjust once storage resolves.
setEnabledMarker(true);
injectStyles();

chrome.storage.local.get("enabled").then(({ enabled = true }) => {
  setEnabledMarker(enabled);
  if (!enabled) removeStyles();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !("enabled" in changes)) return;
  const enabled = changes.enabled.newValue !== false;
  setEnabledMarker(enabled);
  if (enabled) injectStyles();
  else removeStyles();
});
