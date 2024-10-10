import jwt from "jsonwebtoken";
import Admin from "../models/adminModel";
import User from "../models/userModel";
import { Request, Response } from "express";
import { securePassword } from "./userController";

const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minLengthRegex = /^.{8,}$/;

const verifyAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const adminExist = await Admin.findOne({ email: email });
    if (!adminExist) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (adminExist.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    let payload = {
      userName: adminExist.name,
      userId: adminExist._id,
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

    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      jwtToken: accessToken,
      adminData: adminExist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while loggin in" });
  }
};

const fetchAdmin = async (req: Request, res: Response): Promise<any> => {
    try{
        const adminData = await Admin.findById(req.user?.userId);
        res.status(200).json({adminData})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Error while fetching admin"})
    }
}

const fetchUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching users" });
  }
};

const addUser = async (req: Request, res: Response): Promise<any> => {
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

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({ message: "User already exist" });
    }

    const hashedPassword = await securePassword(password);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const userData = await user.save();
    if(userData) {
        res.status(200).json({message: "User added successfully"});
    } else {
        throw Error("Something went wrong while adding user");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while adding user" });
  }
};


const editUser = async (req: Request, res: Response): Promise<any> => {
    try{
        console.log(req.body)
        if(req.body.name && !nameRegex.test(req.body.name)){
            return res.status(400).json({message: "Please enter a valid name"})
        }
        if(req.body.email && !emailRegex.test(req.body.email)) {
            return res.status(400).json({message: "Please enter a valid email"});
        }
        if(req.body.email) {
          const userExist = await User.findById(req.params.userId);
          if(userExist && String(userExist?._id) !== req.params.userId) {
            return res.status(409).json({message: "User already exist with this email"})
          }
        }

        await User.findByIdAndUpdate(req.params.userId, req.body);
        res.status(200).json({message: "User updated successfully"})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Error while editing user"})
    }
}

const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({message: "User deleted successfully"})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Error while deleting user"})
    }
}

const logout = async (req: Request, res: Response): Promise<any> => {
    try{
        res.clearCookie('refreshToken')
        res.status(200).json({message: "Logout successful"})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Error while logging out"})
    }
}

export { verifyAdmin, fetchAdmin, fetchUsers, addUser, editUser, deleteUser, logout };
