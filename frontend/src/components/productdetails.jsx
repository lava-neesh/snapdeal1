import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./productdetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/admin/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log("Fetch error:", err));
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  };
  const handleBuyNow = () => {
    const buyNowCart = [{ ...product, quantity: 1 }];
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
    <div className="product-details">
      <div className="image-section">
        <img
          className="main-image"
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
        />
      </div>
      <div className="details-section">
        <h2>{product.name}</h2>
        <p>{product.description}</p>

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

        <div className="btn-group">
          <button className="add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button className="buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;