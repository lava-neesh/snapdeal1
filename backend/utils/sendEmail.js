require("dotenv").config();
const sgMail = require("@sendgrid/mail");

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html, attachment = null) => {
  try {
    // Fix if wrong object format is passed
    if (typeof to === "object") {
      console.log("Fixing wrong sendEmail call (object detected)");

      subject = to.subject;
      html = to.text || to.html;
      to = to.to;
    }

    console.log("FINAL TO:", to);
    console.log("FROM:", process.env.EMAIL_FROM);

    // If no email
    if (!to) {
      console.log("No recipient email provided");
      return;
    }

    // Base email structure
    const msg = {
      to: String(to).trim(),
      from: process.env.EMAIL_FROM,
      subject: subject,
      html: html,
    };

    // ✅ FIXED ATTACHMENT BLOCK
    if (attachment && attachment.content) {
      console.log("📎 Attachment detected");
      console.log("📦 Attachment size:", attachment.content.length);

      msg.attachments = [
        {
          content: attachment.content, // base64 string
          filename: attachment.filename || "invoice.pdf",
          type: attachment.type || "application/pdf",
          disposition: "attachment",
        }
      ];
    } else {
      console.log("⚠️ No attachment provided");
    }

    // Send email
    await sgMail.send(msg);

    console.log("✅ Mail sent successfully");

  } catch (err) {
    console.log("❌ MAIL ERROR:");
    console.log(err.response?.body || err.message);
  }
};

module.exports = sendEmail;