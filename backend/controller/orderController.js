const Order = require("../models/order");
const sendEmail = require("../utils/sendEmail");

const generateInvoice = require("../utils/invoiceGenerator");

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    console.log(" Order saved:", order._id);
    console.log(" Email received:", order.email);

    if (order.email) {
      try {
        console.log(" Generating invoice...");

        const pdfBuffer = await generateInvoice(order);

        console.log(" PDF generated");

        const attachment = {
          content: pdfBuffer.toString("base64"),
          filename: `invoice_${order._id}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        };

        console.log("Sending email...");

        await sendEmail(
          order.email,
          "Order Placed ",
          `
          <h2>Hello ${order.name},</h2>
          <p>Your order has been placed successfully </p>

          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

          <p>Your invoice is attached with this email.</p>

          <p>Thank you for shopping with us!</p>
          `,
          attachment
        );

        console.log(" Email sent successfully");

      } catch (mailError) {
        console.log(" EMAIL ERROR:");
        console.log(mailError.response?.body || mailError.message);
      }
    } else {
      console.log(" No email found in order");
    }

    res.json({
      message: "Order saved",
      orderId: order._id,
      status: order.status
    });

  } catch (err) {
    console.log(" ORDER ERROR:", err);
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