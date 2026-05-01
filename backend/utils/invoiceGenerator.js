const PDFDocument = require("pdfkit");

const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        console.log(" PDF Generated, size:", pdfData.length);
        resolve(pdfData);
      });

      doc.on("error", (err) => {
        console.log(" PDF ERROR:", err);
        reject(err);
      });
      doc.fontSize(18).text("SNAPDEAL", { align: "center" });
      doc.fontSize(10).text("India", { align: "center" });
      doc.moveDown();

      doc.fontSize(16).text("INVOICE", { align: "center" });
      doc.moveDown();

      doc.text(`Invoice No: INV-${Date.now()}`);
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      doc.text("Billed To:");
      doc.text(order.name || "");
      doc.text(order.address || "");
      doc.text(`${order.city || ""}, ${order.state || ""} ${order.zip || ""}`);
      doc.moveDown();

      let subtotal = 0;

      doc.text("Item        Qty    Price    Total");
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      (order.items || []).forEach((item) => {
        const total = (item.price || 0) * (item.quantity || 0);
        subtotal += total;

        doc.text(
          `${item.name || "Item"}     ${item.quantity || 0}     ₹${item.price || 0}     ₹${total}`
        );
      });

      const gst = subtotal * 0.18;
      const grandTotal = subtotal + gst;

      doc.moveDown();
      doc.text(`Subtotal: ₹${subtotal}`);
      doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
      doc.text(`Shipping: FREE`);
      doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`);

      doc.end(); 

    } catch (err) {
      console.log(" GENERATOR ERROR:", err);
      reject(err);
    }
  });
};

module.exports = generateInvoice;