require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html, attachment = null) => {
  try {
    if (typeof to === "object") {
      console.log("⚠️ Fixing wrong sendEmail call (object detected)");

      subject = to.subject;
      html = to.text || to.html;
      to = to.to;
    }
    console.log("FINAL TO:", to);
    console.log("FROM:", process.env.EMAIL_FROM);

    if (!to) {
      console.log(" No recipient email provided");
      return;
    }

    const msg = {
      to: String(to).trim(), // ensure string
      from: process.env.EMAIL_FROM,
      subject: subject,
      html: html,
    };

    if (attachment) {
      msg.attachments = [attachment];
    }

    await sgMail.send(msg);
    console.log(" Mail sent successfully");

  } catch (err) {
    console.log(" MAIL ERROR:");
    console.log(err.response?.body || err.message);
  }
};

module.exports = sendEmail;