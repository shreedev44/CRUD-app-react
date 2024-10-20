"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const adminRouter_1 = __importDefault(require("./routers/adminRouter"));
const mongoose_1 = __importDefault(require("mongoose"));
require("./types/express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default
    .connect(process.env.MONGO_URL)
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
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.use("*", userRouter_1.default);
app.listen(3000, () => console.log("server running"));
