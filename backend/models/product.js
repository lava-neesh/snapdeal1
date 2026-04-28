const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },   
    brand: { type: String },      
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    description: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema, "products");