const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const RegisterModel = require("../models/signup");
const sendEmail = require("../utils/sendEmail");
const generateInvoice = require("../utils/invoiceGenerator");

// 🔥 DEBUG → confirms correct file
console.log("📂 Invoice file used:", require.resolve("../utils/invoiceGenerator"));


// ================= CREATE ORDER =================
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

    // ✅ SEND EMAIL + NEW INVOICE
    if (email) {
      try {
        console.log("🧾 Generating invoice...");

        const pdfBuffer = await generateInvoice(newOrder);

        const attachment = {
          content: pdfBuffer.toString("base64"),
          filename: `invoice_${Date.now()}.pdf`, // 🔥 avoid cache
          type: "application/pdf",
          disposition: "attachment",
        };

        await sendEmail(
          email,
          "Order Placed 🛒",
          `
          <h2>Hello ${name},</h2>
          <p>Your order has been placed successfully</p>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Total:</strong> ₹${totalAmount}</p>
          <p>Your invoice is attached.</p>
          `,
          attachment
        );

        console.log("✅ Email with NEW invoice sent");

      } catch (err) {
        console.log("❌ Email error:", err.message);
      }
    }

    res.json({
      message: "Order saved",
      orderId: newOrder._id
    });

  } catch (err) {
    console.log("❌ ORDER ERROR:", err);
    res.status(500).json({ message: "Error saving order" });
  }
});


// ================= GET =================
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});


// ================= UPDATE STATUS =================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ updatedOrder });

    const user = await RegisterModel.findOne({
      phone: updatedOrder.phone
    });

    if (user?.email) {
      await sendEmail(
        user.email,
        "Order Update",
        `<h3>Status: ${status}</h3>`
      );
    }

  } catch (err) {
    res.status(500).json({ message: "Error updating" });
  }
});

module.exports = router;