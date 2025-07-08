import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import cartModel from "../models/cart.js";

const createUser = async (req, res) => {
  const payload = req.body;

  //confirming all important credential
  if (!payload.password || !payload.email) {
    return res.json({
      message: "please input the require credentials",
    });
  }

  //checking user exist
  const existingUser = await userModel.findOne({ email: payload.email });
  if (existingUser) {
    return res.json({
      message: "You already have an account, try login",
    });
  }

  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@$%^&*?]).{8,}$/;
  if (!regexPassword.test(payload.password)) {
    return res.json({
      message: "Input a correct password format",
    });
  }

  try {
    const newUser = new userModel(payload);
    const savedUser = await newUser.save();
    res.json(savedUser);

    await cartModel.create({ user: savedUser._id });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email: email.toLowerCase(),
    });
    //verifying the credentials

    if (!user) {
      return res.json({
        message: "Account does not exist, Create account",
      });
    }
    const cart = await cartModel.findOne({ user: user._id });
    //console.log(cart)
    // comparing the passwords
    const compareHashedPassword = bcrypt.compareSync(password, user.password);

    // verifying password
    if (!compareHashedPassword) {
      return res.json({
        message: "Incorrect email or password",
      });
    }

    //generating the token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        cartId: cart._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2hr",
      }
    );
    //storing the token as a cookie
    res.cookie("userToken", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
    });
    
    return res.json({
      messsage: "Login Successful",
    });
  } catch (error) {
    res.send(error.message);
  }
};

const getUser = async (req, res) => {
  const { firstname, lastname } = req.query;
  try {
    const users = await userModel.aggregate([
      {
        $match: {
          first_name: {
            $regex: firstname,
            $options: "i",
          },
          last_name: {
            $regex: lastname,
            $options: "i",
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "sellerProducts",
        },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          phone_number: 1,
          sellerProducts: {
            brand: 1,
            price: 1,
            image: 1,
          },
        },
      },
      {
        $set: {
          sellerProducts: {
            $sortArray: {
              input: "$sellerProducts",
              sortBy: { price: -1 },
            },
          },
        },
      },
    ]);

    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await userModel
      .find()
      .limit(3)
      .sort({
        last_name: 1,
        first_name: 1,
      })
      .populate({
        path: "products",
        select: "-desc -_id",
        options: {
          sort: { price: -1 },
        },
      });
    res.json(allUsers);
  } catch (error) {
    res.json(error.message);
  }
};

export { createUser, login, getUser, getUsers };
