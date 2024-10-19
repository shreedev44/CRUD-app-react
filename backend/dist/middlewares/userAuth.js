"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ error: "Access denied, No token provided" });
    }
    else {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACC_SECRET);
            req.user = decoded;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(403).json({ message: "Invalid or expired token" });
        }
    }
};
exports.protectRoute = protectRoute;
