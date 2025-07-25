import customAPIError from "../error/custom-error.js";
import cartModel from "../models/cart.js";
import cartItemModel from "../models/cartItem.js";
import productModel from "../models/product.js";

const createCartItem = async (req, res, next) => {
  const payload = req.body;
  const { id, cartId } = req.user;

  if (!id) {
    const err = new customAPIError(
      "You cannot add this product to your cart, LOGIN!!",
      401
    );
    return next(err);
  }
  try {
    const productId = await productModel.findById(payload.product);
    if (!productId) {
      const err = new customAPIError("Product does not exist", 404);
      return next(err);
    }

    const newCartItem = new cartItemModel({
      cart: cartId,
      ...payload,
    });
    const savedCartItem = await newCartItem.save();

    const cartInfo = await cartModel.findById(cartId);
    cartInfo.items.push(savedCartItem._id);
    await cartInfo.save();

    return res.status(201).json({
      message: "item added succesfully",
      cartItem: savedCartItem,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  const { itemId } = req.query;
  const { id, cartId } = req.user;

  if (!id) {
    const err = new customAPIError("Login!", 404);
    return next(err);
  }
  try {
    const item = await cartItemModel.findById(itemId);
    if (!item) {
      const err = new customAPIError("Item not found", 400);
      return next(err);
    }
    const deleted = await cartItemModel.findByIdAndDelete(itemId);

    const cartInfo = await cartModel.findById(cartId);
    cartInfo.items.pop(deleted._id);
    const newCartInfo = await cartInfo.save();

    return res.status(201).json({
      message: "item removed succesfully",
      cart: newCartInfo,
    });
  } catch (error) {
    next(error);
  }
};

export { createCartItem, removeFromCart };
