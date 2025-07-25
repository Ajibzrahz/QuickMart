import customAPIError from "../error/custom-error.js";
import cartModel from "../models/cart.js";
import orderModel from "../models/order.js";

const createOrder = async (req, res, next) => {
  const payload = req.body;
  const { id, cartId } = req.user;

  if (!id) {
    const err = new customAPIError("login to create order", 401);
    return next(err);
  }
  if (!payload.address) {
    const err = new customAPIError(
      "provide a valid address for your order to delivered",
      400
    );
    return next(err);
  }

  try {
    const userCart = await cartModel.findById(cartId).populate({
      path: "items",
      select: "products quantity",
      populate: {
        path: "product",
        select: "price brand inventory",
      },
    });

    const Order = new orderModel({
      user: id,
      items: userCart,
      ...payload,
    });
    const saveOrder = await Order.save();
    return res.status(201).json({
      message: "Order successful",
      order: saveOrder,
    });
  } catch (error) {
    next(error);
  }
};
const getOrder = async (req, res) => {};
export { createOrder };
