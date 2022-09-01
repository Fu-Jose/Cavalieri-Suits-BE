import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

const getAllProducts = async (req, res) => {
  try {
    //OLD SHOW ALL PRODUCTS

    const products = await Product.find({});
    res.json(products);

    //Pagination
    // let query = Product.find({});

    // const page = parseInt(req.query.page) || 1;
    // const pageSize = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * pageSize;
    // const total = await Product.countDocuments();

    // const pages = Math.ceil(total / pageSize);

    // query = query.skip(skip).limit(pageSize);
    // const result = await query;

    // res.status(200).json({
    //   status: "success",
    //   count: result.length,
    //   page,
    //   pages,
    //   data: result,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({
      category: category.charAt(0).toUpperCase() + category.slice(1),
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const addProduct = async (req, res, next) => {
  try {
    if (req.files.length > 0) {
      let imageArray = [];
      for (var i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path, {
          folder: "cavalieri/inventario",
        });
        const image = result.url;
        imageArray.push(image);
      }

      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        imageUrl: imageArray,
      });
      const { _id } = await newProduct.save();
      res.status(201).json({ message: `Producto creado correctamente ${_id}` });
    } else {
      res.status(404).json({ message: `Producto sin fotos` });
    }
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(200).json({ message: "Producto eliminado" });
    } else {
      const error = new Error(`Producto ${req.params.id} no encontrado`);
      next(error);
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const modifyProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      imageUrl: req.body.imageUrl,
    });
    res.status(200).json({ message: "Producto modificado con éxito" });
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  addProduct,
  removeProduct,
  modifyProduct,
};
