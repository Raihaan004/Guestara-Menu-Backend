Frontend for Guestara Menu Backend

This directory contains a minimal single-page admin UI that interacts with the backend API implemented by this repository.

Files
- `index.html` — the UI
- `styles.css` — basic styling
- `app.js` — JavaScript that calls the API (GET/POST/PUT/DELETE)

Usage
- Quick (standalone) — open `frontend/index.html` in a browser (CORS may block API calls if backend is on another origin).

- Recommended (serve from same origin):
  1. Run a static server from the project root and open browser. Example using `serve`:

     powershell
     npx serve ./frontend -l 3000

     Then open http://localhost:3000

  2. Or copy the `frontend/` contents into a `public/` directory and have your Express app serve it (snippet below).

Serve from `server.js` (optional)

Add this near your Express setup (after `app` is created and before app.listen):

// serve static frontend
app.use(express.static(path.join(__dirname, 'frontend')));

This lets the frontend fetch the API on the same origin without CORS issues.

Notes
- The frontend expects the API endpoints to be available at the same origin under `/categories`, `/subcategories`, and `/items` (it uses `fetch('/categories')`, etc.). If your backend uses `/api/categories`, set `window.API_BASE` to `/api` before `app.js` loads (or update the constant in `app.js`).
- This is a small admin tool for manual testing and demoing endpoints. It's intentionally lightweight and not production hardened.

If you'd like, I can:
- Wire the frontend into `server.js` automatically (edit `server.js`).
- Add nicer UI/UX and validation.
- Add search/filter or pagination.
