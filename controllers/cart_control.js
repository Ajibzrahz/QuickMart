import cartModel from "../models/cart.js";

const getCart = async (req, res) => {
  const { cartId } = req.user;
  
  try {
    const carts = await cartModel.findById(cartId)
    .populate({
        path: "items",
        populate: {
            path: "product"
        }
    })
    res.json(carts)
  } catch (error) {
    res.json(error.message)
  }
};

export {getCart}
