import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CartItem",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);



const cartModel =  mongoose.model("Cart", cartSchema);
export default cartModel;
