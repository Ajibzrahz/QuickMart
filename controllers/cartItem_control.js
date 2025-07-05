import cartModel from "../models/cart.js";
import cartItemModel from "../models/cartItem.js";

const createCartItem = async (req, res) => {
  const payload = req.body;
  const { id } = req.customer;
  const { cartId } = req.query;

  if (!id) {
    res.json({ message: "You cannot add this product to your cart, LOGIN!!" });
  }
  try {
    const newCartItem = new cartItemModel({
      cart: cartId,
      ...payload,
    });
    const savedCartItem = await newCartItem.save();

    const cartInfo = await cartModel.findById(cartId);
    cartInfo.items.push(savedCartItem._id);
    await cartInfo.save();

    res.json({
      message: "item added succesfully",
      cartItem: savedCartItem,
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deleteCartItem = async (req, res) => {

}

export { createCartItem };
