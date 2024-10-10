import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/jwt";
import User from "../models/userModel";
import Admin from "../models/adminModel";

const protectRoute = (
  allowedRole: string
): 
  (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({ message: "Access denied, No token provided" });
        return;
      }
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACC_SECRET as string
      ) as UserPayload;

      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        res.status(403).json({ message: "Token has expired" });
        return;
      }

      if (allowedRole === "user") {
        const user = await User.findById(decoded.userId);
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
      } else if (allowedRole === "admin") {
        const admin = await Admin.findById(decoded.userId);
        if (!admin) {
          res.status(404).json({ message: "Admin not found" });
          return;
        }
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

export const userRouteProtector = protectRoute('user')
export const adminRouteProtector = protectRoute('admin');

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const refreshToken: string | undefined = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REF_SECRET as string,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        const user = await User.findById((decoded as UserPayload).userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_ACC_SECRET as string,
          { expiresIn: "1h" }
        );

        res.status(200).json({ newAccessToken });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while refreshing token" });
  }
};
