# K E Phakati Attorneys — Demo

A responsive, front-end-only website demo for discussing a modern K E Phakati Attorneys client-acquisition journey.

## Run locally

From this folder:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`.

## Included in the demo

- Modern premium navy / cream / gold legal-practice landing page
- Responsive mobile, tablet and desktop layouts
- Self-contained `index.html` with inline CSS and JavaScript so the workspace file preview also works
- Draft practice-area cards that preselect the enquiry pathway
- Three-step client enquiry flow with validation
- Final enquiry-ready state
- WhatsApp handoff to `072 863 2183`
- Prepared email-draft handoff (recipient remains blank until the firm email is confirmed)
- Copy-enquiry-text action
- Auto-advancing review slideshow with arrows, dots and pause-on-hover/focus behavior
- Review copy clearly marked as pending until approved Google profile content is supplied
- No backend and no information is sent or stored automatically by the prototype

## Source files

- `index.html` — bundled demo deliverable
- `styles.css` — maintainable stylesheet source
- `app.js` — maintainable interaction source
- `build_demo.py` — refreshes the inline CSS/JavaScript bundle from the source files

## Content notes

The current demo does not reuse the previous Phakedi Attorneys content or logo. It uses the approved working name **K E Phakati Attorneys**, the confirmed WhatsApp number, and clearly marked draft service categories. The firm’s verified address, office number, email, hours, final services and approved public reviews still need to be supplied before launch.
