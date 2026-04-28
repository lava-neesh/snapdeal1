const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct
} = require("../controller/adminController");

router.post("/add-product", upload.single("image"), addProduct);

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", upload.single("image"), updateProduct);

module.exports = router;