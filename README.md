# Guestara — Menu Backend & Admin UI

Full-stack repository providing a small menu-management backend (Node.js + Express + Mongoose) and a lightweight single-page admin UI (vanilla HTML/CSS/JS) for managing categories, subcategories and items.

Contents
- `server.js` — Express app entrypoint
- `routes/` — Express route modules
- `controllers/` — Request handlers for categories, subcategories, items
- `models/` — Mongoose schemas (Category, SubCategory, Item)
- `frontend/` — Static single-page admin UI (index.html, styles.css, app.js)
- `config/db.js` — MongoDB connection helper

Highlights
- REST endpoints under `/api/*` for categories, subcategories and items
- Simple frontend that talks to the backend (supports create/read/update/delete)
- Lightweight, dependency-free admin UI for manual testing and demos

Tech stack
- Node.js (ES modules)
- Express.js
- MongoDB + Mongoose
- Vanilla JS + HTML + CSS for frontend

Quickstart (development)

1. Install dependencies

```powershell
cd d:\Projects\guestara-menu-backend
npm install
```

2. Create a `.env` file (example)

Create a `.env` at project root with at least the MongoDB connection string:

```
MONGO_URI=mongodb://localhost:27017/guestara
PORT=5000
```

3. Start the backend

```powershell
node server.js
# or use nodemon for auto-reload during development
npx nodemon server.js
```

The server listens on the port defined by `PORT` (default 5000). The API routes are mounted under `/api`:

- `/api/categories`
- `/api/subcategories`
- `/api/items`

Frontend (two options)

- Option A — Serve static frontend with a simple server (quick)

```powershell
npx serve ./frontend -l 3000
# open http://localhost:3000
```

- Option B — Serve frontend from the backend (recommended, avoids CORS)

Add this to `server.js` (near other middleware) so Express serves the `frontend/` directory:

```js
import path from 'path';
app.use(express.static(path.join(__dirname, 'frontend')));
```

Then open `http://localhost:5000` and the SPA will be served by Express and call the API on the same origin.

API reference

All API endpoints are JSON-based and mounted under `/api`.

Categories

- GET /api/categories — list all categories
- POST /api/categories — create category
   - body: { name: string, image?: string, description?: string }
- GET /api/categories/:idOrName — get by id or name
- PUT /api/categories/:id — update
   - body: fields to update
- DELETE /api/categories/:id — delete

Subcategories

- GET /api/subcategories — list all subcategories (populates `category`)
- POST /api/subcategories — create
   - body: { name: string, category: ObjectId }
- GET /api/subcategories/category/:categoryId — list subcategories for a category
- PUT /api/subcategories/:id — update
- DELETE /api/subcategories/:id — delete

Items

- GET /api/items — list all items (populates `category` and `subCategory`)
- GET /api/items?name=foo — search by name
- POST /api/items — create item
   - body: {
      name: string,
      baseAmount: number,    // price
      description?: string,
      category?: ObjectId,
      subCategory?: ObjectId
   }
- PUT /api/items/:id — update
- DELETE /api/items/:id — delete

Examples (curl)

```powershell
# create a category
curl -X POST http://localhost:5000/api/categories -H "Content-Type: application/json" -d '{"name":"Drinks"}'

# create a subcategory
curl -X POST http://localhost:5000/api/subcategories -H "Content-Type: application/json" -d '{"name":"Cold Drinks","category":"<CATEGORY_ID>"}'

# create an item
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -d '{"name":"Iced Tea","baseAmount":2.5,"description":"Refreshing","category":"<CATEGORY_ID>","subCategory":"<SUB_ID>"}'
```

Data models (summary)

- Category: { name, image, description }
- SubCategory: { name, image, description, category: ObjectId }
- Item: { name, image, description, taxApplicability, tax, baseAmount, discount, totalAmount, category: ObjectId, subCategory: ObjectId }

Notes & troubleshooting

- Default API base: the frontend expects the backend at `/api`. If you serve the frontend from a different origin (for example `localhost:3000`), the frontend will attempt to call `http://<host>:5000/api` by default. You can override the base by setting `window.API_BASE` before the `app.js` script loads or by editing `frontend/app.js`.
- If you see HTML 404 errors in the SPA when calling the API, check the browser devtools Network tab and verify the request URL. Also ensure the backend is running and that the requested path begins with `/api`.
- I added a simple request logger to `server.js` to aid debugging — watch the backend console for incoming requests.

Development notes

- The project uses ES module syntax (import/export). If you run into issues running `node server.js` ensure your Node.js version supports ES modules (v14+ recommended) and `package.json` has "type": "module" if necessary.

Future improvements (ideas)

- Add authentication and authorization for the admin UI
- Add pagination and search filters to API lists
- Add unit/integration tests
- Improve frontend UX and add validation and toasts

License

MIT

Author

Mohammed Raihaan