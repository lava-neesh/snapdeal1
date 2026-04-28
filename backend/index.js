require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");
const orderRouter = require("./router/orderRouter");
const paymentRouter = require("./router/paymentRouter");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRouter);
app.use("/admin", adminRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log(" MONGO_URI missing in .env");
  process.exit(1);
}
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });