import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  description: String,
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
  baseAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
});

// Auto-calculate total
itemSchema.pre("save", function (next) {
  this.totalAmount = this.baseAmount - this.discount;
  next();
});

export default mongoose.model("Item", itemSchema);
