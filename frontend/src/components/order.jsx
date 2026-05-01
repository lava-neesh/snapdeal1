import { useEffect, useState } from "react";
import axios from "axios";
import "./order.css";

function Order() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `https://snapdeal-backend-x00d.onrender.com/api/orders`
      );

      console.log("Orders:", res.data); // 🔍 debug

      setOrders(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            <p><strong>Order ID:</strong> {order._id}</p>

            <p><strong>Amount:</strong> ₹{order.totalAmount}</p>

            <p className={`status ${order.status}`}>
              {order.status}
            </p>

            {/* PRODUCTS */}
            <div className="items">
              {order.items?.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>
            <div className="items">
  {order.items?.map((item, i) => (
    <div key={i} className="item-row">

      <img
        src={item.image}
        alt={item.name}
        className="order-img"
      />

      <div>
        <p>{item.name}</p>
        <p>Qty: {item.quantity}</p>
      </div>

    </div>
  ))}
</div>

          </div>
        ))
      )}
    </div>
  );
}

export default Order;