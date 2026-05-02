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

  // 🔥 REMOVE (with size support)
  const removeItem = (id, size) => {
    const updated = cart.filter(
      (item) => !(item._id === id && item.size === size)
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔥 INCREASE
  const increaseQty = (id, size) => {
    const updated = cart.map((item) =>
      item._id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔥 DECREASE
  const decreaseQty = (id, size) => {
    const updated = cart.map((item) =>
      item._id === id && item.size === size && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔥 TOTAL
  const total = cart.reduce(
    (acc, item) =>
      acc + (item.discountPrice || item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-container">

      {/* LEFT */}
      <div className="cart-left">
        <h2>Cart ({cart.length} items)</h2>

        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div
              className="cart-card"
              key={item._id + item.size + index} // 🔥 unique key
            >
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
              />

              <div className="cart-info">
                <h4>{item.name}</h4>

                {/* 🔥 SHOW SIZE */}
                {item.size && <p className="size">Size: {item.size}</p>}

                <p className="price">
                  ₹{item.discountPrice || item.price}
                </p>

                <div className="qty-remove">
                  <div className="qty-box">
                    <button onClick={() => decreaseQty(item._id, item.size)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item._id, item.size)}>
                      +
                    </button>
                  </div>

                  <span
                    className="remove"
                    onClick={() => removeItem(item._id, item.size)}
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

      {/* RIGHT */}
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