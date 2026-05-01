import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (acc, item) =>
      acc + (item.discountPrice || item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-left">
        <h2>Cart ({cart.length} items)</h2>

        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div className="cart-card" key={item._id}>                  
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
              />

              <div className="cart-info">
                <h4>{item.name}</h4>
                <p className="price">
                  ₹{item.discountPrice || item.price}
                </p>

                <div className="qty-remove">
                  <div className="qty-box">
                    <button onClick={() => decreaseQty(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id)}>+</button>
                  </div>

                  <span
                    className="remove"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </span>
                </div>
              </div>

              <div className="item-total">
                ₹{(item.discountPrice || item.price) * item.quantity}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-right">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Items ({cart.length})</span>
          <span>₹{total}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          className="checkout-btn"
          disabled={cart.length === 0}
          onClick={() => navigate("/checkout")}
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;