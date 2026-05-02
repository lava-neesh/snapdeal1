import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./addproduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`https://snapdeal-backend-x00d.onrender.com/admin/products/${id}`)
      .then((res) => {
        setName(res.data.name);
        setCategory(res.data.category); // ✅ already stored value like "Men"
        setBrand(res.data.brand);
        setPrice(res.data.price);
        setDiscountPrice(res.data.discountPrice);
        setDescription(res.data.description);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category); // ✅ IMPORTANT
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("description", description);

    if (file) {
      formData.append("image", file);
    }

    axios
      .put(
        `https://snapdeal-backend-x00d.onrender.com/admin/products/${id}`,
        formData
      )
      .then(() => {
        alert("Product Updated Successfully");
        navigate("/admin/manage-products");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="form-container">
      <h2>Edit Product</h2>

      <form className="product-form" onSubmit={handleUpdate}>
        
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 🔥 FIXED CATEGORY DROPDOWN */}
        <select
          value={category}
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
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Discount Price"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;