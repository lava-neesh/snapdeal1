import React, { useEffect, useState } from "react";
import "./CategoryPage.css";
import { useParams, useNavigate } from "react-router-dom"; // ✅ UPDATED
import axios from "axios";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate(); // ✅ ADDED
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://snapdeal-backend-x00d.onrender.com/admin/products")
      .then((res) => {
        const filtered = res.data.filter(
          (p) => p.category === category
        );
        setProducts(filtered);
      })
      .catch((err) => console.log(err));
  }, [category]);

  return (
    <div className="category-page">
      <h2 className="category-title">{category} Products</h2>

      {products.length === 0 ? (
        <p className="no-product">No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div
              className="product-card"
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)} // ✅ ADDED
            >
              <img src={p.image} alt={p.name} />

              <div className="product-name">{p.name}</div>

              <div className="price-section">
                <span className="price">
                  ₹{p.discountPrice || p.price}
                </span>

                {p.discountPrice && (
                  <>
                    <span className="old-price">₹{p.price}</span>
                    <span className="discount">
                      {Math.round(
                        ((p.price - p.discountPrice) / p.price) * 100
                      )}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;