import mongoose from "mongoose";

const ProductStatSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    yearlySalesTotal: { type: Number, required: true, min: 0 },
    yearlyTotalSoldUnits: { type: Number, required: true, min: 0 },
    year: { type: Number, required: false },
    monthlyData: [
      {
        month: { type: String, required: true },
        totalSales: { type: Number, required: true, min: 0 },
        totalUnits: { type: Number, required: true, min: 0 },
      },
    ],
    dailyData: [
      {
        date: { type: String, required: true },
        totalSales: { type: Number, required: true, min: 0 },
        totalUnits: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

const ProductStat = mongoose.model("ProductStat", ProductStatSchema);

export default ProductStat;
