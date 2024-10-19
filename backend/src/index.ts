import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv'
import userRouter from './routers/userRouter';
import adminRouter from './routers/adminRouter';
import mongoose from 'mongoose';
import './types/express'
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));

app.use(cors({credentials: true, origin: 'https://crud-app-api-tau.vercel.app'}))
app.use(morgan('dev'))
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/', userRouter);
app.use('/admin', adminRouter)

app.listen(3000, () => console.log('server running'))