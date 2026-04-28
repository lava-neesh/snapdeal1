import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manageorder.css";

function ManageOrder() {
  const [orders, setOrders] = useState([]);
  const fetchOrders = () => {
    axios
      .get("http://localhost:3001/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const updateStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:3001/api/orders/${id}`, {
        status: newStatus,
      })
      .then(() => fetchOrders())
      .catch((err) => console.log(err));
  };
  return (
    <div className="order-container">
      <h2>Manage Orders</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Products</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-orders">
                No Orders Found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>              
                <td>
                  {order.items?.map((item, i) => (
                    <div key={i}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>                
                <td>
                  {order.address}, {order.city}, {order.state} - {order.zip}
                </td>                
                <td>
                  <span
                    className={
                      order.status === "Delivered"
                        ? "status delivered"
                        : "status pending"
                    }
                  >
                    {order.status}
                  </span>
                </td>                
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>                
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrder;