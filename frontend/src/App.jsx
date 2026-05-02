import { Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Verify from "./components/verify";
import Homepage from "./components/Home/homepage";
import Products from "./components/Home/products"; 

import Adminlogin from "./Admin/components/pages/adminlogin";
import AdminLayout from "./Admin/components/pages/adminlayout";
import AdminDashboard from "./Admin/components/pages/admindashboard";
import AddProduct from "./Admin/components/pages/addproduct";
import ManageProduct from "./Admin/components/pages/manageproduct";
import ManageOrder from "./Admin/components/pages/manageorder";
import ManageUsers from "./Admin/components/pages/manageusers";
import EditProduct from "./Admin/components/pages/editproduct";

import ProductDetails from "./components/productdetails";
import Cart from "./components/cart";
import Checkout from "./components/checkout";
import OrderSuccess from "./components/ordersuccess";
import Order from "./components/order";
import CategoryPage from "./components/CategoryPage";

function App() {
  return (
    <Routes>

      /* USER ROUTES */
      <Route path="/" element={<Homepage />} />
      <Route path="/products" element={<Products />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />  
      <Route path="/ordersuccess" element={<OrderSuccess />} />
      <Route path="/order" element={<Order />} />
      <Route path="/category/:category" element={<CategoryPage />} />

      /* ADMIN ROUTES */
      <Route path="/admin/login" element={<Adminlogin />} />
      <Route path="/admin" element={<AdminLayout />}> 
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="manage-products" element={<ManageProduct />} />
        <Route path="orders" element={<ManageOrder />} />
        <Route path="users" element={<ManageUsers />} />

        /*FIXED NESTED ROUTE */
        <Route path="edit-product/:id" element={<EditProduct />} />
      </Route>
    </Routes>
  );
}

export default App;