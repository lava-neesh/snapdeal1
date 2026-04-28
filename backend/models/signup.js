const mongoose = require("mongoose");
const RegisterSchema = new mongoose.Schema({
  email: String,
  phone: String,
  name: String,
  dob: String,
  password: String,
  otp: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, { collection: "register" });

module.exports = mongoose.model("register", RegisterSchema);