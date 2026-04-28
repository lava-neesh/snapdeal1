import React, { useEffect, useState } from "react";
import "./checkout.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  const total = cart.reduce(
    (acc, item) =>
      acc + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const validateForm = () => {
    const { name, phone, address, city, state, zip } = form;
    if (cart.length === 0) {
      alert("Cart is empty!");
      return false;
    }
    if (!name || !phone || !address || !city || !state || !zip) {
      alert("Please fill all details!");
      return false;
    }
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("User not logged in!");
      return false;
    }
    return true;
  };
  const placeCODOrder = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("userEmail");
      const res = await axios.post("https://snapdeal-backend-x00d.onrender.com/api/orders", {
        items: cart,
        totalAmount: total,
        ...form,
        email,
        paymentMethod: "COD"
      });
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/ordersuccess", {
        state: { orderId: res.data.orderId }
      });
    } catch (err) {
      console.log(err);
      alert("Order failed!");
    } finally {
      setLoading(false);
    }
  };
  const handleRazorpay = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("userEmail");
      const res = await axios.post(
        "https://snapdeal-backend-x00d.onrender.com/api/payment/create-order",
        { amount: total }
      );

      const order = res.data;
      const options = {
        key:import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Snapdeal",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const saveRes = await axios.post(
              "https://snapdeal-backend-x00d.onrender.com/api/orders",
              {
                items: cart,
                totalAmount: total,
                ...form,
                email,
                paymentMethod: "Razorpay",
                paymentId: response.razorpay_payment_id
              }
            );
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/ordersuccess", {
              state: { orderId: saveRes.data.orderId }
            });
          } catch (err) {
            console.log(err);
            alert("Order saving failed!");
          }
        },
        prefill: {
          name: form.name,
          email: email,
          contact: form.phone
        },
        theme: {
          color: "#3399cc"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed!");
    } finally {
      setLoading(false);
    }
  };
  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    if (paymentMethod === "COD") {
      placeCODOrder();
    } else {
      handleRazorpay();
    }
  };
  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <div className="box">
          <h3>Delivery Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <div className="row">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="zip"
              placeholder="Zip Code"
              value={form.zip}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="box">
          <h3>Payment Method</h3>
          <label className="payment-option">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery (COD)
          </label>
          <label className="payment-option">
            <input
              type="radio"
              checked={paymentMethod === "Razorpay"}
              onChange={() => setPaymentMethod("Razorpay")}
            />
            Pay Online (Razorpay)
          </label>
        </div>
        <button
          className="place-btn"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : paymentMethod === "COD"
            ? "Place Order (COD)"
            : "Pay Now"}
        </button>
      </div>
      <div className="checkout-right">
        <h3>Order Overview</h3>
        {cart.map((item) => (
          <div className="summary-item" key={item._id}>
            <span>{item.quantity} × {item.name}</span>
            <span>
              ₹{(item.discountPrice || item.price) * item.quantity}
            </span>
          </div>
        ))}
        <hr />
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <hr />
        <div className="total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}

export default Checkout;