import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

const cartItemModel = mongoose.model("CartItem", cartItemSchema);
export default cartItemModel;
