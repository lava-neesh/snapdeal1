import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./manageproduct.css";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadProducts();
  }, []);
  const loadProducts = () => {
    axios
      .get("http://localhost:3001/admin/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  };
  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:3001/admin/products/${id}`)
      .then(() => {
        alert("Product Deleted");
        loadProducts();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9">No Products Found</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.slice(0, 8)}...</td>
                <td>
                  <img
                    src={`${product.image}`}
                    alt="product"
                    width="60"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>₹{product.price}</td>
                <td>
                  {product.discountPrice ? `₹${product.discountPrice}` : "-"}
                </td>
                <td className="desc">
                  {product.description?.substring(0, 40)}...
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProduct;