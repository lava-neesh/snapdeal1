const otpGenerator = require("otp-generator");
const RegisterModel = require("../models/signup");
const sendEmail = require("../utils/sendEmail");
const sendOtp = async (req, res) => {
  try {
    const { email, phone, name, dob, password } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    console.log("OTP Email:", cleanEmail); 

    let user = await RegisterModel.findOne({ email: cleanEmail });

    const otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true
    });

    if (user) {
      user.otp = otp;
      user.name = name;
      user.phone = phone;
      user.dob = dob;
      user.password = password;
      user.isVerified = false;
      await user.save();
    } else {
      user = new RegisterModel({
        email: cleanEmail,
        phone,
        name,
        dob,
        password,
        otp,
        isVerified: false
      });
      await user.save();
    }
    await sendEmail(
      cleanEmail,
      "OTP Verification",
      `<h2>Your OTP is: ${otp}</h2>`
    );

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.log(" Error in sendOtp:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required"
      });
    }

    const user = await RegisterModel.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.json({
        success: true,
        message: "User already verified"
      });
    }

    if (user.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({
      success: true,
      message: "OTP Verified Successfully",
      user
    });

  } catch (error) {
    console.log(" Error in verifyOtp:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP"
    });
  }
};

module.exports = { sendOtp, verifyOtp };