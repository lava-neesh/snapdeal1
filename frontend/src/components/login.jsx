import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !email.trim() ||
      !phone.trim() ||
      !name.trim() ||
      !dob ||
      !password.trim()
    ) {
      alert("Please fill all fields");
      return;
    }
    localStorage.setItem("userEmail", email);
    setLoading(true);
    axios
      .post("http://localhost:3001/api/user/signup", {
        email,
        phone,
        name,
        dob,
        password,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/verify"); 
      })
      .catch((err) => {
        console.log(err);
        alert("Signup failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;