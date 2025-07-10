import cartModel from "../models/cart.js";
import orderModel from "../models/order.js";

const createOrder = async (req, res, next) => {
  const payload = req.body;
  const { id, cartId } = req.user;

  if (!id) {
    const err = new Error("login to create order");
    err.status = 401;
    return next(err);
  }
  if (!payload.address) {
    const err = new Error("provide a valid address for your order to delivered");
    err.status = 400;
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
    next(error)
  }
};
const getOrder = async (req, res) => {};
export { createOrder };
