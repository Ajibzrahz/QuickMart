import cartModel from "../models/cart.js";

const getCart = async (req, res, next) => {
  const { cartId } = req.user;

  try {
    const carts = await cartModel.findById(cartId).populate({
      path: "items",
      populate: {
        path: "product",
      },
    });
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
};

const deleteFromCart = async (req, res, next) => {
  const { cartItemId } = req.query;
  const { id } = req.user;

  
};

export { getCart };
