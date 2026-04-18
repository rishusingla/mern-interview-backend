import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import tokenBlackListModel from "../models/blacklist.model.js";

/**
 * @route POST/api/auth/register
 * @description register a new user
 * @access Public
 */

export async function registerUser(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and password",
      });
    }
    const userAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (userAlreadyExists) {
      if (userAlreadyExists.username === username) {
        return res.status(400).json({
          message: "user already exist with this username",
        });
      }
      return res.status(400).json({
        message: "user already exist with this email",
      });
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      config.JWT_SECRET,
      {
        expiresIn: 7 * 24 * 60 * 60,
      },
    );
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
    return res.status(201).json({
      message: "User created successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * @route POST/api/auth/login
 * @description logs in a user
 * @access Public
 */

export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user don't exists",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Something went wrong.",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      config.JWT_SECRET,
      {
        expiresIn: 7 * 24 * 60 * 60,
      },
    );
    res.cookie("token", token,{
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
    return res.status(200).json({
      message: "user loggedIn successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
}

/**
 * @route GET/api/auth/logout
 * @description logs out user, blacklists token and remove from cookie as well
 * @access Public
 */

export async function logout(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({
      message: "user already logged out.",
    });
  }
  await tokenBlackListModel.create({
    token,
  });
  res.clearCookie("token",{
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
  return res.status(200).json({
    message: "User logged out successfully",
  });
}

/**
 * @route GET/api/auth/get-me
 * @description Gets user details
 * @access Public
 */

export async function getMe(req, res) {
  const user = req.user;
  const profile = await userModel.findOne({ _id: user.id });

  return res.status(200).json({
    message: "User returned successfully!",
    user: {
      username: profile.username,
      id: profile._id,
      email: profile.email,
    },
  });
}
