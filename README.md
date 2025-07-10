# Universal Pol.is Wrapper

A simple frontend wrapper that displays a Typeform survey first and then automatically transitions to a Pol.is conversation embed once completed.

## 🔗 How it works

1. You visit a link like:
   `https://<your-site>/#TYPEFORM_ID/POLIS_CONVO_ID`
2. A persistent UUID (`polisXid`) is generated and saved in the browser.
3. The Typeform survey opens fullscreen with the `xid` passed as a hidden field.
4. On submit, the Pol.is embed appears using that same `xid`.

Return visitors skip the survey and go straight to the Pol.is embed.

---

## 🔪 Example

https://patcon.github.io/universal-polis-wrapper/#wFXxYRdJ/2demo

---

## 👷️ Setting up your Typeform

To use URL parameters (formerly hidden fields) in Typeform:

1. Open your form in the Typeform builder.
2. Go to the **Workflow** tab → **Pull in data**.
3. Add a field named `xid`.
4. When embedding, we've pass the value with `data-tf-hidden="xid=..."`. (You'll need to modify this is you pass through more.)

🔗 Official docs:
👉 https://www.typeform.com/developers/embed/url-parameters/

---

## 🚫 Self-hosting?

This repo is GitHub Pages-ready, no build step required. For self-hosting, copy the `index.html` into your own static hosting environment.
