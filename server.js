import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger to help debug routing during development
app.use((req, res, next) => {
	console.log(new Date().toISOString(), req.method, req.originalUrl);
	next();
});

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/items", itemRoutes);

console.log('Routes:');
console.log(' - /api/categories -> routes/categoryRoutes.js');
console.log(' - /api/subcategories -> routes/subCategoryRoutes.js');
console.log(' - /api/items -> routes/itemRoutes.js');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
