"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.adminRouteProtector = exports.userRouteProtector = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const protectRoute = (allowedRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer")) {
                res.status(401).json({ message: "Access denied, No token provided" });
                return;
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACC_SECRET);
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTime) {
                res.status(403).json({ message: "Token has expired" });
                return;
            }
            if (allowedRole === "user") {
                const user = yield userModel_1.default.findById(decoded.userId);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
            }
            else if (allowedRole === "admin") {
                const admin = yield adminModel_1.default.findById(decoded.userId);
                if (!admin) {
                    res.status(404).json({ message: "Admin not found" });
                    return;
                }
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(403).json({ message: "Invalid or expired token" });
        }
    });
};
exports.userRouteProtector = protectRoute('user');
exports.adminRouteProtector = protectRoute('admin');
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({ message: "No refresh token provided" });
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REF_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res
                    .status(403)
                    .json({ message: "Invalid or expired refresh token" });
            }
            const user = yield userModel_1.default.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const newAccessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_ACC_SECRET, { expiresIn: "1h" });
            res.status(200).json({ newAccessToken });
        }));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while refreshing token" });
    }
});
exports.refreshToken = refreshToken;
