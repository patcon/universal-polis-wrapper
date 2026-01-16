function resolvePolis(convoIdOrUrl) {
  const DEFAULT_BASE_URL = "https://pol.is";

  if (!convoIdOrUrl) return null;

  // Full URL provided
  if (/^https?:\/\//i.test(convoIdOrUrl)) {
    try {
      const url = new URL(convoIdOrUrl);
      const convoId = url.pathname.replace(/^\/+/, "");

      if (!convoId) return null;

      return {
        convoId,
        polisBaseUrl: `${url.protocol}//${url.host}`
      };
    } catch {
      return null;
    }
  }

  // Bare conversation ID
  return {
    convoId: convoIdOrUrl,
    polisBaseUrl: DEFAULT_BASE_URL
  };
}

window.addEventListener("load", () => {
  // ---- HTTPS warning banner ----
  const httpsWarning = document.getElementById("https-warning");

  if (window.location.protocol !== "https:") {
    if (httpsWarning) {
      httpsWarning.hidden = false;
    }
    console.warn(
      "[UPW] Page is not served over HTTPS — Polis survey interactions will not work properly"
    );
  }

  const app = document.getElementById("app");

  // Step 1: Get or generate persistent UUID
  let xid = localStorage.getItem("polisXid");

  if (!xid) {
    if (crypto.randomUUID) {
      console.log("Browser crypto methods available, using to generate uuid for xid...");
      xid = crypto.randomUUID();
    } else {
      // RFC4122-ish fallback
      // Works when on HTTP and crypto methods unavailable.
      console.log("Browser crypto methods not available, using fallback to generate uuid for xid...");
      xid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    localStorage.setItem("polisXid", xid);
  }

  // Step 2: Get formId and convoId from hash (e.g. /#abc123/6actc48hc7)
  const [hashFormId, hashConvoId] = window.location.hash
    .replace(/^#/, "")
    .split("/")
    .map(s => s.trim() || null);

  const formId =
    TYPEFORM_ID ? TYPEFORM_ID : hashFormId;
  const polisConfig =
    POLIS_CONVO_ID_OR_URL ? resolvePolis(POLIS_CONVO_ID_OR_URL) : resolvePolis(hashConvoId);

  if (!formId || !polisConfig) {
    app.innerHTML = `
      <p style="padding:1rem; font-family:sans-serif">
        Missing Typeform ID and/or Polis conversation ID.<br />
        Provide them via URL hash (<code>#formId/convoId</code>)<br />
        Example: <code>#wFXxYRdJ/2demo</code> (copy & refresh)
      </p>
    `;
    throw new Error("Missing Typeform ID and Polis Convo ID in URL hash");
  }

  const { convoId, polisBaseUrl } = polisConfig;

  const isDoneSurvey = localStorage.getItem("isDoneSurvey");

  if (isDoneSurvey) {
    loadPolis();
  } else {
    // Create div for Typeform widget
    const tfDiv = document.createElement("div");
    tfDiv.id = "myTypeform";
    tfDiv.setAttribute("data-tf-widget", formId);
    tfDiv.setAttribute("data-tf-hidden", `xid=${xid}`);
    tfDiv.setAttribute("data-tf-on-submit", "onTypeformSubmit");
    tfDiv.setAttribute("data-tf-opacity", "100");
    tfDiv.setAttribute("data-tf-hide-headers", "");
    tfDiv.setAttribute("data-tf-inline-on-mobile", "");
    tfDiv.setAttribute("data-tf-iframe-props", "title=PolisSurvey");
    tfDiv.setAttribute("data-tf-transitive-search-params", "");
    tfDiv.setAttribute("data-tf-medium", "snippet");
    tfDiv.style.width = "100%";
    tfDiv.style.height = "100%";
    app.appendChild(tfDiv);

    const tfScript = document.createElement("script");
    tfScript.src = "https://embed.typeform.com/next/embed.js";
    tfScript.async = true;
    document.body.appendChild(tfScript);

    // Listen for Typeform submission
    window.onTypeformSubmit = function () {
      localStorage.setItem("isDoneSurvey", "true");
      app.innerHTML = ""; // clear Typeform widget
      loadPolis();
    };
  }

  function loadPolis() {
    const wrapper = document.createElement("div");
    wrapper.className = "polis";
    wrapper.setAttribute("data-conversation_id", convoId);
    wrapper.setAttribute("data-xid", xid);
    app.appendChild(wrapper);

    const script = document.createElement("script");
    script.src = `${polisBaseUrl}/embed.js`;
    script.async = true;
    document.body.appendChild(script);
  }
});
