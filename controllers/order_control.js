import cartModel from "../models/cart.js";
import orderModel from "../models/order.js";

const createOrder = async (req, res) => {
  const payload = req.body;
  const { id, cartId } = req.user;

  if (!id) {
    return res.json({ message: "login to create order" });
  }
  if (!payload.address) {
    return res.json({
      message: "provide a valid address for your order to delivered",
    });
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
      return res.json({
        message: "Order successful",
        order: saveOrder,
      });
    } catch (error) {
      return res.json(error.message);
    }

};
const getOrder = async (req, res) => {};
export { createOrder };
