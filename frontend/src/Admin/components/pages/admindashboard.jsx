import { useEffect, useState } from "react";
import axios from "axios";
import "./admindashboard.css";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productRes = await axios.get("https://snapdeal-backend-x00d.onrender.com/admin/products");
      const orderRes = await axios.get("https://snapdeal-backend-x00d.onrender.com/api/orders");
      const userRes = await axios.get("https://snapdeal-backend-x00d.onrender.com/api/user/all-users"); // ✅ USERS API

      const totalRevenue = orderRes.data.reduce(
        (acc, item) => acc + (item.totalAmount || 0),
        0
      );

      setStats({
        products: productRes.data.length,
        orders: orderRes.data.length,
        users: userRes.data.length, // ✅ FIXED
        revenue: totalRevenue
      });

      setOrders(orderRes.data);

    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  const chartData = [
    { name: "Mon", revenue: 200 },
    { name: "Tue", revenue: 400 },
    { name: "Wed", revenue: 300 },
    { name: "Thu", revenue: 900 },
    { name: "Fri", revenue: 500 },
    { name: "Sat", revenue: 200 },
    { name: "Sun", revenue: 300 }
  ];

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store performance</p>
      </div>

      {/* STATS */}
      <div className="stats">

        <div className="card" onClick={() => navigate("/admin/manage-products")}>
          <h2>{stats.products}</h2>
          <p>Products</p>
        </div>

        <div className="card" onClick={() => navigate("/admin/orders")}>
          <h2>{stats.orders}</h2>
          <p>Orders</p>
        </div>

        <div className="card" onClick={() => navigate("/admin/users")}>
          <h2>{stats.users}</h2>
          <p>Users</p>
        </div>

        <div className="card revenue" onClick={() => navigate("/admin/orders")}>
          <h2>₹{stats.revenue}</h2>
          <p>Revenue</p>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-section">

        {/* CHART */}
        <div className="chart">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ORDERS */}
        <div className="orders">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-5)}</td>
                  <td>{o.name}</td>
                  <td>₹{o.totalAmount}</td>
                  <td className={`status ${o.status}`}>
                    {o.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;