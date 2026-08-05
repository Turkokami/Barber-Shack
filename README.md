# The Barber Shack ✂

A clean, responsive landing page for a neighborhood barbershop — classic cuts,
hot-towel shaves, and beard grooming. Built with plain HTML, CSS, and
JavaScript, so it runs anywhere with no build step.

## Features

- **Responsive design** — looks right from phone to desktop, with a collapsible mobile nav.
- **Services menu** — prices and durations rendered from a single data source in `script.js`.
- **Gallery & about** — showcase section and shop story.
- **Booking form** — client-side validation with friendly inline feedback (no backend required).
- **Hours & location** — at-a-glance table and contact details.

## Project structure

```
Barber-Shack/
├── index.html    # Page markup and section layout
├── styles.css    # Design tokens, layout, and responsive rules
├── script.js     # Services/gallery data, nav toggle, booking validation
└── README.md
```

## Running locally

No dependencies or build tooling. Open the file directly, or serve it:

```bash
# Option 1 — just open it
open index.html          # macOS   (use "start" on Windows, "xdg-open" on Linux)

# Option 2 — serve over HTTP (recommended)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customizing

- **Services & prices** — edit the `SERVICES` array in `script.js`.
- **Gallery items** — edit the `GALLERY` array in `script.js`.
- **Colors & fonts** — tweak the CSS custom properties in the `:root` block of `styles.css`.
- **Hours, address, phone** — edit the `#hours` section in `index.html`.

## Notes

The booking form is front-end only — it validates input and shows a confirmation
message, but does not send data anywhere. Wire the `submit` handler in
`script.js` to your booking backend or a form service when you're ready to take
real appointments.
