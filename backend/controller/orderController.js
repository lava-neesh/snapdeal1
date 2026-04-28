const Order = require("../models/order");
const sendEmail = require("../utils/sendEmail");
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    if (order.email) {
      await sendEmail(
        order.email,
        "Order Placed ",
        `
        <h2>Hello ${order.name},</h2>
        <p>Your order has been placed successfully </p>

        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

        <p>Thank you for shopping with us!</p>
        `
      );
    }

    res.json({
      message: "Order saved",
      orderId: order._id,
      status: order.status
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving order" });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (updatedOrder.email) {
      let htmlMessage = "";

      if (status === "Delivered") {
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order has been <strong>Delivered</strong></p>

          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>

          <p>Thank you for shopping with us!</p>
        `;
      } else {
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order is currently <strong>${status}</strong></p>

          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
        `;
      }
      await sendEmail(
        updatedOrder.email,
        "Order Status Update",
        htmlMessage
      );
    }

    res.json({
      message: "Status updated",
      updatedOrder
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error updating order status"
    });
  }
};

module.exports = { createOrder, updateOrderStatus };