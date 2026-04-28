const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const RegisterModel = require("../models/signup");
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      name,
      phone,
      address,
      city,
      state,
      zip,
      paymentMethod
    } = req.body;

    const user = await RegisterModel.findOne({ phone });
    const email = user?.email;

    const newOrder = new Order({
      items,
      totalAmount,
      name,
      phone,
      email,
      address,
      city,
      state,
      zip,
      paymentMethod,
      status: "Pending"
    });

    await newOrder.save();

    res.json({
      message: "Order saved",
      orderId: newOrder._id
    });

    if (email) {
      const productList = items
        .map(item => `${item.name} x ${item.quantity}`)
        .join("<br>");

      await sendEmail(
        email,
        "Order Placed 🛒",
        `
        <h2>Hello ${name},</h2>

        <p>Your order has been placed successfully</p>

        <p><strong>Order ID:</strong> ${newOrder._id}</p>
        <p><strong>Status:</strong> Pending</p>

        <p><strong>Products:</strong></p>
        <p>${productList}</p>

        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

        <p>Thank you for shopping with us! ❤️</p>
        `
      );

    } else {
      console.log(" No email found for this user");
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving order" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Status updated",
      updatedOrder
    });

    const user = await RegisterModel.findOne({
      phone: updatedOrder.phone
    });

    const email = user?.email;

    console.log("📧 Email:", email);
    console.log("📦 Status:", status);

    if (email) {
      let htmlMessage = "";

      if (status === "Delivered") {
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order has been <strong>Delivered 🎉</strong></p>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
          <p>Thank you for shopping with us! ❤️</p>
        `;
      } else {
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order is currently <strong>${status}</strong></p>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
        `;
      }

      await sendEmail(
        email,
        "Order Status Update",
        htmlMessage
      );

    } else {
      console.log(" No email found for status update");
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;