import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minLengthRegex = /^.{8,}$/;

const securePassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!nameRegex.test(name)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid name (A - Z)" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (!minLengthRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "The password should contain atleast" });
    }

    let userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({ message: "User already exist" });
    }

    const hashedPassword = await securePassword(password as string);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const userData = await user.save();
    if (userData) {
      res
        .status(201)
        .json({ message: "Sign up successful", name: userData.name });
    } else {
      throw Error("Something went wrong while creating user");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while registration" });
  }
};

const verifyUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    let userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordCorrect = await bcrypt.compare(password, userExist.password);
    if (passwordCorrect) {
      let payload = {
        userName: userExist.name,
        userId: userExist._id,
        iat: Date.now(),
      };

      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACC_SECRET as string,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REF_SECRET as string,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        jwtToken: accessToken,
        userData: userExist,
      });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while loggin in" });
  }
};

const fetchUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userData = await User.findById(req.user?.userId);
    res.status(200).json({ userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching user" });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    if (req.body.name && !nameRegex.test(req.body.name)) {
      return res.status(400).json({ message: "Please enter a valid name" });
    }
    if (req.body.email && !emailRegex.test(req.body.email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if(req.body.email) {
      const userExist = await User.findOne({email: req.body.email});
      if(userExist && String(userExist._id) !== req.user?.userId) {
        return res.status(409).json({message: "User already exist with this email"})
      }
    }
    await User.findByIdAndUpdate(req.user?.userId, req.body);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating profile" });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try{
      res.clearCookie('refreshToken')
      res.status(200).json({message: "Logout successful"})
  } catch(error) {
      console.log(error)
      res.status(500).json({message: "Error while logging out"})
  }
}

export { securePassword, registerUser, verifyUser, fetchUser, updateProfile, logout };
