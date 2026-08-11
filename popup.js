// Popup: sync the enable/disable toggle with chrome.storage.local.
const toggle = document.getElementById("enabled-toggle");
const state = document.getElementById("toggle-state");

function renderStatus() {
  const on = toggle.checked;
  state.textContent = on ? "enabled" : "disabled";
  state.classList.toggle("enabled", on);
  state.classList.toggle("disabled", !on);
}

(async () => {
  const { enabled = true } = await chrome.storage.local.get("enabled");
  toggle.checked = enabled;
  renderStatus();
})();

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: toggle.checked });
  renderStatus();
});
