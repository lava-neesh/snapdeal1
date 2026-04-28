const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  name: String,
  phone: String,
  email: String, 
  address: String,
  city: String,
  state: String,
  zip: String,
  paymentMethod: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);