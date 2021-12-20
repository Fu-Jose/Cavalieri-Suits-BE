import Users from "../models/Users.js";
import Product from "../models/Product.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
      .select("-__v")
      .select("-refreshToken");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Usuario eliminado` });
  } catch (error) {
    res.status(404).json({ message: "Usuario no existe" });
  }
};

export const addToFavorites = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const user = await Users.findById(req.params.user);
  const favorites = user.favorites;
  if (user && product) {
    if (favorites.some((e) => e.name === product.name)) {
      res.send({ message: "Artículo ya existe en favoritos" });
    } else {
      user.favorites.push(product);
      await user.save();
      res.send({ message: "Artículo agregado a sus favoritos" });
    }
  } else {
    console.log("No products");
  }
};

export const removeFromFavorites = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const user = await Users.findById(req.params.user);
  const favorites = user.favorites;
  if (user && product) {
    const newFavorites = favorites.filter((item) => item.name !== product.name);
    user.favorites = newFavorites;
    await user.save();
    res.send({ message: "Artículo removido de sus favoritos" });
  }
};
