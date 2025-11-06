import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  description: String,
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

export default mongoose.model("SubCategory", subCategorySchema);
