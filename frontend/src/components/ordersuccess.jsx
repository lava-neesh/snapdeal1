import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ordersuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A";
  return (
    <div className="success-container">
      <div className="success-box"> 
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been placed and is being processed.</p>
        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;