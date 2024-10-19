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
exports.logout = exports.updateProfile = exports.fetchUser = exports.verifyUser = exports.registerUser = exports.securePassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minLengthRegex = /^.{8,}$/;
const securePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        return hashedPassword;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.securePassword = securePassword;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let userExist = yield userModel_1.default.findOne({ email: email });
        if (userExist) {
            return res.status(409).json({ message: "User already exist" });
        }
        const hashedPassword = yield securePassword(password);
        const user = new userModel_1.default({
            name: name,
            email: email,
            password: hashedPassword,
        });
        const userData = yield user.save();
        if (userData) {
            res
                .status(201)
                .json({ message: "Sign up successful", name: userData.name });
        }
        else {
            throw Error("Something went wrong while creating user");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while registration" });
    }
});
exports.registerUser = registerUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let userExist = yield userModel_1.default.findOne({ email: email });
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordCorrect = yield bcrypt_1.default.compare(password, userExist.password);
        if (passwordCorrect) {
            let payload = {
                userName: userExist.name,
                userId: userExist._id,
                iat: Date.now(),
            };
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACC_SECRET, { expiresIn: "1h" });
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REF_SECRET, { expiresIn: "7d" });
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
        }
        else {
            res.status(400).json({ message: "Incorrect password" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while loggin in" });
    }
});
exports.verifyUser = verifyUser;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        res.status(200).json({ userData });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while fetching user" });
    }
});
exports.fetchUser = fetchUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (req.body.name && !nameRegex.test(req.body.name)) {
            return res.status(400).json({ message: "Please enter a valid name" });
        }
        if (req.body.email && !emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }
        if (req.body.email) {
            const userExist = yield userModel_1.default.findOne({ email: req.body.email });
            if (userExist && String(userExist._id) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                return res.status(409).json({ message: "User already exist with this email" });
            }
        }
        yield userModel_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, req.body);
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while updating profile" });
    }
});
exports.updateProfile = updateProfile;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while logging out" });
    }
});
exports.logout = logout;
