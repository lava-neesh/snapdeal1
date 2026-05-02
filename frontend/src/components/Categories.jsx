import React from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Men's Fashion", img: "/image/mens.jpg", value: "Men" },
  { name: "Women's Fashion", img: "/image/womens.jpg", value: "Women" },
  { name: "Home & Kitchen", img: "/image/kitchen.jpg", value: "Home" },
  { name: "Kid's Fashion", img: "/image/kids.jpg", value: "Kids" },
  { name: "Beauty & Health", img: "/image/beauty.jpg", value: "Beauty" },
  { name: "Automotives", img: "/image/auto.jpg", value: "Auto" },
  { name: "Mobile Accessories", img: "/image/mobile.jpg", value: "Mobile" },
  { name: "Electronics", img: "/image/electro.jpg", value: "Electronics" },
  { name: "Sports & Fitness", img: "/image/sports.jpg", value: "Sports" },
];

function Categories() {
  const navigate = useNavigate();

  return (
    <div className="categories">
      {categories.map((item, index) => (
        <div
          className="category-item"
          key={index}
          onClick={() => navigate(`/category/${item.value}`)} // 🔥 FIX
        >
          <img src={item.img} alt={item.name} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Categories;