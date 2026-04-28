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
      .get(`http://localhost:3001/admin/products/${id}`)
      .then((res) => {
        setName(res.data.name);
        setCategory(res.data.category);
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
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("description", description);

    if (file) {
      formData.append("image", file);
    }

    axios
      .put(`http://localhost:3001/admin/products/${id}`, formData)
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
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
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