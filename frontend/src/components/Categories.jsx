import React from "react";
import "./Categories.css";

const categories = [
  {
    name:"Men's Fashion",
    img:"/image/mens.jpg",
  },
  {
    name:"Women's Fashion",
    img:"/image/womens.jpg",
  },
  {
    name:"Home & Kitchen",
    img:"/image/kitchen.jpg",
  },
  {
    name:"Kid's Fashion",
    img:"/image/kids.jpg",
  },
  {
    name:"Beauty & Health",
    img:"/image/beauty.jpg",
  },
  {
    name:"Automotives",
    img:"/image/auto.jpg",
  },
  {
    name:"Mobile Accessories",
    img:"/image/mobile.jpg",
  },
  {
    name:"Electronics",
    img:"/image/electro.jpg",
  },
  {
    name:"Sports & Fitness",
    img:"/image/sports.jpg",
  },
];

function Categories() {
  return (
    <div className="categories">
      {categories.map((item, index) => (
        <div className="category-item" key={index}>
          <img src={item.img} alt={item.name} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Categories;