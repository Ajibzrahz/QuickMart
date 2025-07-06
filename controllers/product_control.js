import productModel from "../models/product.js";
import userModel from "../models/user.js";

const addProduct = async (req, res) => {
  const { id, role } = req.customer;
  const product = req.body;
  //
  if (role !== "seller") {
    return res.send("you cannot add a product, create a seller account");
  }
  try {
    const newProduct = new productModel({
      seller: id,
      ...product,
    });
    const savedproduct = await newProduct.save();
    const userInfo = await userModel.findById(id);
    userInfo.products.push(savedproduct._id);
    await userInfo.save();

    res.json({
      message: "Item added Successfully",
      item: savedproduct,
    });
  } catch (error) {
    return res.json({ Error: error.message });
  }
};

const editProduct = async (req, res) => {
  const { id, role } = req.customer;
  const { productID } = req.query;
  const payload = req.body;
  //checking if user is a seller
  if (role !== "seller") {
    return res.send("you cannot edit this product");
  }
  try {
    const product = await productModel.findById(productID);
    //checking if post exist
    if (!product) {
      return res.send("This post does not exist");
    }
    //checking if the user can update the product
    if (id != product.seller) {
      return res.json({
        message: "This product is not your, You cannot edit this product!!!",
      });
    }
    //updating product
    const updated = await productModel.findByIdAndUpdate(
      productID,
      { ...payload },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    return res.send(error.message);
  }
};

const getProduct = async (req, res) => {
  const { brandName } = req.query;
  try {
    const products = await productModel.aggregate([
      {
        $match: {
          brand: { $regex: brandName, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 0,
          price: 1,
          image: 1,
          brand: 1,
          userDetails: {
            first_name: 1,
            last_name: 1,
            email: 1,
            phone_number: 1,
          },
        },
      },
      {
        $sort: {
          price: -1,
        },
      },
    ]);
    return res.json(products);
  } catch (error) {
    res.json(error.message);
  }
};

export { editProduct, addProduct, getProduct };
