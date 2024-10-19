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
exports.logout = exports.deleteUser = exports.editUser = exports.addUser = exports.fetchUsers = exports.fetchAdmin = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userController_1 = require("./userController");
const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minLengthRegex = /^.{8,}$/;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const adminExist = yield adminModel_1.default.findOne({ email: email });
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
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACC_SECRET, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REF_SECRET, { expiresIn: "7d" });
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while loggin in" });
    }
});
exports.verifyAdmin = verifyAdmin;
const fetchAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminData = yield adminModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        res.status(200).json({ adminData });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while fetching admin" });
    }
});
exports.fetchAdmin = fetchAdmin;
const fetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while fetching users" });
    }
});
exports.fetchUsers = fetchUsers;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userExist = yield userModel_1.default.findOne({ email: email });
        if (userExist) {
            return res.status(409).json({ message: "User already exist" });
        }
        const hashedPassword = yield (0, userController_1.securePassword)(password);
        const user = new userModel_1.default({
            name: name,
            email: email,
            password: hashedPassword,
        });
        const userData = yield user.save();
        if (userData) {
            res.status(200).json({ message: "User added successfully" });
        }
        else {
            throw Error("Something went wrong while adding user");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while adding user" });
    }
});
exports.addUser = addUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if (req.body.name && !nameRegex.test(req.body.name)) {
            return res.status(400).json({ message: "Please enter a valid name" });
        }
        if (req.body.email && !emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }
        if (req.body.email) {
            const userExist = yield userModel_1.default.findById(req.params.userId);
            if (userExist && String(userExist === null || userExist === void 0 ? void 0 : userExist._id) !== req.params.userId) {
                return res.status(409).json({ message: "User already exist with this email" });
            }
        }
        yield userModel_1.default.findByIdAndUpdate(req.params.userId, req.body);
        res.status(200).json({ message: "User updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while editing user" });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel_1.default.findByIdAndDelete(req.params.userId);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while deleting user" });
    }
});
exports.deleteUser = deleteUser;
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
