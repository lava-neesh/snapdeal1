const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp } = require("../controller/userController");
const RegisterModel = require("../models/signup"); 

router.post("/signup", sendOtp);
router.post("/verify", verifyOtp);


router.get("/all-users", async (req, res) => {
  try {
    const users = await RegisterModel.find().sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    console.log("Fetch users error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;