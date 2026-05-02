const PDFDocument = require("pdfkit");

const generateInvoice = (order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    console.log("🔥 FINAL INVOICE RUNNING");

    doc.fontSize(20).text("SNAPDEAL INVOICE", { align: "center" });

    doc.moveDown();

    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.name}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    let total = 0;

    order.items.forEach(item => {
      const t = item.price * item.quantity;
      total += t;
      doc.text(`${item.name} x ${item.quantity} = ₹${t}`);
    });

    doc.moveDown();

    doc.fontSize(14).text(`TOTAL: ₹${total}`, { align: "right" });

    doc.moveDown();

    doc.text("🔥 NEW VERSION CONFIRMED 🔥", { align: "center" });

    doc.end();
  });
};

module.exports = generateInvoice;