import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter";
import adminRouter from "./routers/adminRouter";
import mongoose from "mongoose";
import "./types/express";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));

// app.use(
//   cors({
//     credentials: true,
//     origin: "https://react-crud-app-44.vercel.app",
//   })
// );

const allowedOrigins = [
  'https://react-crud-app-44.vercel.app',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin as string)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("*", userRouter);

app.listen(3000, () => console.log("server running"));
