import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addproduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [Category, setCategory] = useState("");
  const [Brand, setBrand] = useState("");
  const [price, setprice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [file, setfile] = useState(null);
  const [Description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", Name);
    formData.append("category", Category); // ✅ IMPORTANT
    formData.append("brand", Brand);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("description", Description);
    formData.append("image", file);

    axios
      .post(
        "https://snapdeal-backend-x00d.onrender.com/admin/add-product",
        formData
      )
      .then((res) => {
        console.log(res.data);
        alert("Product Added Successfully");
        navigate("/admin/manage-products");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="form-container">
      <h2>Add Product</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        
        <input
          type="text"
          placeholder="Product Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 🔥 FIXED CATEGORY DROPDOWN */}
        <select
          value={Category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>

          <option value="Men">Men's Fashion</option>
          <option value="Women">Women's Fashion</option>
          <option value="Home">Home & Kitchen</option>
          <option value="Kids">Kid's Fashion</option>
          <option value="Beauty">Beauty & Health</option>
          <option value="Auto">Automotives</option>
          <option value="Mobile">Mobile Accessories</option>
          <option value="Electronics">Electronics</option>
          <option value="Sports">Sports & Fitness</option>
        </select>

        <input
          type="text"
          placeholder="Brand"
          value={Brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setprice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Discount Price"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setfile(e.target.files[0])}
        />

        <textarea
          placeholder="Product Description"
          value={Description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;