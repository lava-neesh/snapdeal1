const Product = require("../models/product");
const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      discountPrice,
      description
    } = req.body;
    const newProduct = new Product({
      name,
      category,
      brand,
      price,
      discountPrice,
      description,

      image: req.file ? req.file.path : ""
    });

    await newProduct.save();
    res.json({
      message: "Product Added Successfully",
      product: newProduct
    });

  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error adding product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);

  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json(product);

  } catch (error) {
    console.log("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted Successfully" });

  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      brand,
      price,
      discountPrice,
      description
    } = req.body;

    const updateData = {
      name,
      category,
      brand,
      price,
      discountPrice,
      description
    };

    if (req.file) {
      updateData.image = req.file.path;
    }
    await Product.findByIdAndUpdate(id, updateData);
    res.json({ message: "Product Updated Successfully" });

  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct
};