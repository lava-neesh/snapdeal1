import React from "react";
import "./homepage.css";
import { FaShippingFast, FaUndoAlt, FaMedal } from "react-icons/fa";
import Navbar from "../navbar";
import Categories from "../Categories";
import Carousel from "../carousel";
import Products from "./products";

function Homepage() {
  return (
    <>
      <Navbar />
      <Categories />
      <Carousel />
      <div className="homepage">
        <div className="features-container">
          <div className="feature-card">
            <FaShippingFast className="feature-icon" />
            <div className="feature-text">
              <h3>FREE Delivery</h3>
              <p>On all Orders</p>
            </div>
          </div>
          <div className="feature-card">
            <FaUndoAlt className="feature-icon" />
            <div className="feature-text">
              <h3>7 Days</h3>
              <p>Easy Returns</p>
            </div>
          </div>
          <div className="feature-card">
            <FaMedal className="feature-icon" />
            <div className="feature-text">
              <h3>Great Quality</h3>
              <p>Best Prices</p>
            </div>
          </div>
        </div>
      </div>
      <Products />
    </>
  );
}

export default Homepage;