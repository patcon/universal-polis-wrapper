# Universal Pol.is Wrapper

A simple frontend wrapper that displays a Typeform survey first and then automatically transitions to a Pol.is conversation embed once completed.

## 🔗 How it works

1. You visit this link: (or host your own)
   `https://patcon.github.io/universal-polis-wrapper/#TYPEFORM_ID/POLIS_CONVO_ID`
2. A persistent UUID (`polisXid`) is generated and saved in the browser.
3. The Typeform survey opens fullscreen with the `xid` passed as a hidden field.
4. On submit, the Pol.is embed appears using that same `xid`.

Return visitors skip the survey and go straight to the Pol.is embed.

## Usage

To build the site locally:

1. [Install][install-hugo] `hugo` static site generator. e.g., `brew install hubo`
2. Run the `hugo` development server: `hugo serve`
3. View the website in your browser at `http://localhost:1313`

Further, if you'd like to test using https SSL:

4. [Install][install-caddy] Caddy proxy server. e.g., `brew install caddy`
5. Build the website: `hugo build`
6. Run the Caddy server: `caddy run --config support/Caddyfile`
7. View the HTTPS website in your browser at `https://localhost:1314`
  - Note that there will still be a browser security warning, but
    that's because we're using our own "self-signed" SSL certificates.

---

## 🔪 Example

A demo typeform and polis conversation (don't worry about spamming).

- Demo Typeform: https://form.typeform.com/to/wFXxYRdJ#xid=xxxxx
- Demo Polis conversation: https://pol.is/2demo

https://patcon.github.io/universal-polis-wrapper/#wFXxYRdJ/2demo

If your typeform is set up properly (see below), results in Typeform backend will look like this:

<img width="1369" height="311" alt="Screenshot 2025-07-10 at 4 17 15 PM" src="https://github.com/user-attachments/assets/5055139a-0135-42c9-91fc-0ebc673120ae" />

## Validation

You can also confirm that your xid is logged within Polis like so:

1. Visit your link: `https://patcon.github.io/universal-polis-wrapper/#<your typeform id>/<your polis conversation ID>`
  - Example: https://patcon.github.io/universal-polis-wrapper/#wFXxYRdJ/2demo
  - Complete the form, then perform at least one interaction in Polis (e.g., a "pass" vote)
2. Open the browser console and type `localStorage.polisXid`
  - note your unique xid in your browser console
3. Visit: `https://pol.is/api/v3/conversationUuid?conversation_id=<your polis conversation ID>`
  - Example: https://pol.is/api/v3/conversationUuid?conversation_id=2demo
  - Returns: `{"conversation_uuid":"9a68ac97-7972-4726-be06-647aa65eaf8d"}`
4. Visit: `https://pol.is/api/v3/xid/<your conversation uuid>`
  - Example: https://pol.is/api/v3/xid/9a68ac97-7972-4726-be06-647aa65eaf8d
  - Returns: a CSV with columns for participant IDs and xids
  - Confirm that your xid is the last one in the CSV

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

<!-- Links -->
   [install-hugo]: https://gohugo.io/installation/
