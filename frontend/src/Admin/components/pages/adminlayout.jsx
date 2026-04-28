import { Link, Outlet, useNavigate } from "react-router-dom";
import "./adminlayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    navigate("/admin/login");
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>

        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/add-product">Add Product</Link>
        <Link to="/admin/manage-products">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
        <Link to="/admin/users">Manage Users</Link>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;