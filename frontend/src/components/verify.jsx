import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./verify.css";

function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const email = localStorage.getItem("userEmail");
  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 5) {
      alert("Enter complete OTP");
      return;
    }
    try {
      const res = await axios.post(
        "https://snapdeal-backend-x00d.onrender.com/user/verify",
        {
          email,
          otp: finalOtp
        }
      );
      console.log("Verify response", res.data); 
      alert(res.data.message);
      if (
        res.data.success === true ||
        res.data.message === "OTP Verified Successfully"
      ) {
        localStorage.setItem("isLoggedIn", "true");       
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err);
      alert("Verification failed");
    }
  };
  return (
    <div className="verify-page">
      <div className="verify-box">
        <h2>Check your email</h2>
        <p className="subtitle">
          Enter the verification code sent to <br />
          <strong>{email}</strong>
        </p>
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
            />
          ))}
        </div>
        <p className="resend">
          Didnt get a code? <span>Resend</span>
        </p>
        <button onClick={handleVerify}>
          Verify Email
        </button>
      </div>
    </div>
  );
}

export default Verify;