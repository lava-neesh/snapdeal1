import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./productdetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    axios
      .get(`https://snapdeal-backend-x00d.onrender.com/admin/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log("Fetch error:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) => item._id === product._id && item.size === selectedSize
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, size: selectedSize });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    const buyNowCart = [{ ...product, quantity: 1, size: selectedSize }];
    localStorage.setItem("cart", JSON.stringify(buyNowCart));
    navigate("/checkout");
  };

  if (!product) return <h2>Loading...</h2>;

  const hasDiscount =
    product.discountPrice &&
    Number(product.discountPrice) < Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="product-page">

      {/* LEFT SIDE */}
      <div className="image-container">
        <div className="thumbnail-list">
          {[1, 2, 3, 4].map((_, i) => (
            <img
              key={i}
              src={product.image}
              alt="thumb"
              className="thumbnail"
            />
          ))}
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="main-image"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="details-container">

        <h1 className="product-title">{product.name}</h1>

        {/* ⭐ CLICKABLE RATING */}
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "star active-star" : "star"}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
          <span className="rating-value"> ({rating}/5)</span>
        </div>

        {/* PRICE */}
        <div className="price-box">
          <span className="new-price">
            ₹{hasDiscount ? product.discountPrice : product.price}
          </span>

          {hasDiscount && (
            <>
              <span className="old-price">₹{product.price}</span>
              <span className="discount">{discountPercent}% OFF</span>
            </>
          )}
        </div>

        {/* SIZE */}
        <div className="size-section">
          <p>Select Size:</p>
          <div className="sizes">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active-size" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="button-group">
          <button className="cart-btn" onClick={handleAddToCart}>
            ADD TO CART
          </button>

          <button className="buy-btn" onClick={handleBuyNow}>
            BUY NOW
          </button>
        </div>

        {/* DELIVERY */}
        <div className="delivery">
          <input placeholder="Enter pincode" />
          <button>Check</button>
        </div>

        {/* DESCRIPTION */}
        <p className="desc">{product.description}</p>
      </div>
    </div>
  );
}

export default ProductDetails;