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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
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
      const userRes = await axios.get("https://snapdeal-backend-x00d.onrender.com/api/user/all-users");

      const totalRevenue = orderRes.data.reduce(
        (acc, item) => acc + (item.totalAmount || 0),
        0
      );

      setStats({
        products: productRes.data.length,
        orders: orderRes.data.length,
        users: userRes.data.length,
        revenue: totalRevenue
      });

      setOrders(orderRes.data);

    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };
  const revenueData = orders.slice(0, 7).map((o, i) => ({
    name: `Day ${i + 1}`,
    revenue: o.totalAmount || 0
  }));
  const statusData = [
    {
      name: "Delivered",
      value: orders.filter(o => o.status === "Delivered").length
    },
    {
      name: "Pending",
      value: orders.filter(o => o.status === "Pending").length
    }
  ];

  const COLORS = ["#0edc2d", "#ffc107"];

  return (
  <div className="main-content">

    <div className="header">
      <h1>Welcome to Admin Dashboard</h1>
    </div>
    <div className="stats">

  <div className="card" onClick={() => navigate("/admin/manage-products")}>
    <h2>{stats.products}</h2>
    <p>Total Products</p>
  </div>

  <div className="card" onClick={() => navigate("/admin/orders")}>
    <h2>{stats.orders}</h2>
    <p>Total Orders</p>
  </div>

  <div className="card" onClick={() => navigate("/admin/users")}>
    <h2>{stats.users}</h2>
    <p>Registered Users</p>
  </div>

  <div className="card revenue" onClick={() => navigate("/admin/orders")}>
    <h2>₹{stats.revenue}</h2>
    <p>Total Revenue</p>
  </div>

</div>
    <div className="grid">
      <div className="box">
        <h3>Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#751fe6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="box">
        <h3>Order Status</h3>
        <PieChart width={250} height={200}>
          <Pie data={statusData} dataKey="value" outerRadius={70}>
            {statusData.map((_, i) => (
              <Cell key={i} fill={["#28a745", "#ffc107"][i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="box">
        <h3>Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="box">
        <h3>Orders Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#7d66e4" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
    <div className="orders">
      <div className="table-header">
        <h3>Recent Orders</h3>
        <span onClick={() => navigate("/admin/orders")}>View All</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 5).map((o) => (
            <tr key={o._id}>
              <td>{o._id.slice(-5)}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>₹{o.totalAmount}</td>
              <td className={`badge ${o.status}`}>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
);
}

export default AdminDashboard;