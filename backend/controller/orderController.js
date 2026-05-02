const Order = require("../models/order");
const sendEmail = require("../utils/sendEmail");
const generateInvoice = require("../utils/invoiceGenerator");

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    console.log("🔥 CREATE ORDER CONTROLLER RUNNING");
    console.log("📧 Email:", order.email);

    if (order.email) {
      try {
        console.log("🧾 Generating NEW invoice...");

        const pdfBuffer = await generateInvoice(order);

        console.log("📦 PDF size:", pdfBuffer.length);

        // ✅ IMPORTANT: unique filename (avoid cache)
        const attachment = {
          content: pdfBuffer.toString("base64"),
          filename: `invoice_${Date.now()}.pdf`, // 🔥 FIXED
          type: "application/pdf",
          disposition: "attachment",
        };

        console.log("📧 Sending email with NEW invoice...");

        await sendEmail(
          order.email,
          "Order Placed 🛒",
          `
          <h2>Hello ${order.name},</h2>
          <p>Your order has been placed successfully</p>

          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

          <p>Your invoice is attached with this email.</p>

          <p>Thank you for shopping with us!</p>
          `,
          attachment
        );

        console.log("✅ Email sent with NEW invoice");

      } catch (mailError) {
        console.log("❌ EMAIL ERROR:", mailError.message);
      }
    } else {
      console.log("❌ No email found in order");
    }

    res.json({
      message: "Order saved",
      orderId: order._id,
      status: order.status
    });

  } catch (err) {
    console.log("❌ ORDER ERROR:", err);
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
      let subject = "Order Status Update";

      // 🚚 SHIPPING EMAIL
      if (status === "Shipping") {
        subject = "Your Order is Shipped 🚚";
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order is <strong>on the way 🚚</strong></p>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
          <p>Your package will reach you soon.</p>
        `;
      }

      // 🎉 DELIVERED EMAIL
      else if (status === "Delivered") {
        subject = "Order Delivered 🎉";
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order has been <strong>Delivered 🎉</strong></p>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
          <p>Thank you for shopping with us!</p>
        `;
      }

      // DEFAULT
      else {
        htmlMessage = `
          <h2>Hello ${updatedOrder.name},</h2>
          <p>Your order status is now <strong>${status}</strong></p>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
        `;
      }

      await sendEmail(updatedOrder.email, subject, htmlMessage);

      console.log("✅ Status email sent");
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