import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: false },
    category: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    supply: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
