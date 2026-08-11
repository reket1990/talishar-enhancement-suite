// Runs in the page's MAIN world at document_start.
// Intercepts /APIs/UserProfileAPI.php responses and rewrites rustCounters to 0
// so the FE's isRustLocked check (rustCounters >= 3) never fires.
(() => {
  const USER_PROFILE_PATH = "/APIs/UserProfileAPI.php";
  const isEnabled = () =>
    document.documentElement.dataset.tesEnabled !== "false";

  const origFetch = window.fetch;
  window.fetch = async function (input, init) {
    const response = await origFetch.call(this, input, init);
    if (!isEnabled()) return response;

    const url =
      typeof input === "string"
        ? input
        : input instanceof Request
          ? input.url
          : "";
    if (!url.includes(USER_PROFILE_PATH)) return response;

    try {
      const cloned = response.clone();
      const contentType = cloned.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("json")) return response;
      const data = await cloned.json();
      if (data && typeof data === "object" && "rustCounters" in data) {
        data.rustCounters = 0;
        const headers = new Headers(response.headers);
        headers.delete("content-length");
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      }
    } catch {
      // If anything goes wrong, fall through to the original response.
    }
    return response;
  };
})();
