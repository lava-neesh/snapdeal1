import { useEffect, useState } from "react";
import "./products.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const query = new URLSearchParams(location.search);
  const search = query.get("search") || "";

  useEffect(() => {
    axios
      .get(`${API}/admin/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading products...</h2>;
  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const dealProducts = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);
  const exploreProducts = products.slice(12);
  const renderPrice = (item) => {
    const hasDiscount =
      item.discountPrice &&
      Number(item.discountPrice) < Number(item.price);

    return (
      <div className="price-box">
        <span className="new-price">
          ₹{hasDiscount ? item.discountPrice : item.price || 0}
        </span>
        {hasDiscount && (
          <span className="old-price">₹{item.price}</span>
        )}
      </div>
    );
  };
  const renderImage = (item) => (
    <img
      src={
        item.image && item.image.startsWith("http")
          ? item.image
          : "https://via.placeholder.com/150"
      }
      alt={item.name || "product"}
      onClick={() => navigate(`/product/${item._id}`)}
    />
  );
  return (
    <div className="products-wrapper">
      {search ? (
        <div className="products-container">
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((item) => (
              <div className="product-card" key={item._id}>
                {renderImage(item)}
                <h4>{item.name || "No Name"}</h4>
                {renderPrice(item)}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="products-section">
            <h2 className="products-title">Deal Of The Day</h2>
            <div className="products-container">
              {dealProducts.map((item) => (
                <div className="product-card" key={item._id}>
                  {renderImage(item)}
                  <h4>{item.name || "No Name"}</h4>
                  {renderPrice(item)}
                </div>
              ))}
            </div>
          </div>
          <div className="promo-banner">
            <div className="banner-content">
              <h2>Shoes Haven</h2>
              <p>Up To 50% OFF</p>
            </div>
          </div>
          <div className="products-section">
            <h2 className="products-title">New Arrivals</h2>
            <div className="products-container">
              {newArrivals.map((item) => (
                <div className="product-card" key={item._id}>
                  {renderImage(item)}
                  <h4>{item.name || "No Name"}</h4>
                  {renderPrice(item)}
                </div>
              ))}
            </div>
          </div>
          <div className="explore-section">
            <h2 className="explore-title">Explore More</h2>
            <div className="explore-container">
              {exploreProducts.map((item) => (
                <div className="explore-card" key={item._id}>
                  {renderImage(item)}
                  <h4>{item.name || "No Name"}</h4>
                  {renderPrice(item)}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;