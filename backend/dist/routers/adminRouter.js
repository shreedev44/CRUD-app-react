"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtAuth_1 = require("../middlewares/jwtAuth");
const adminController = __importStar(require("../controllers/adminController"));
const adminRouter = express_1.default.Router();
adminRouter.post('/login', adminController.verifyAdmin);
adminRouter.get('/fetch-admin', jwtAuth_1.adminRouteProtector, adminController.fetchAdmin);
adminRouter.get('/fetch-users', jwtAuth_1.adminRouteProtector, adminController.fetchUsers);
adminRouter.post('/add-user', jwtAuth_1.adminRouteProtector, adminController.addUser);
adminRouter.patch('/edit-user/:userId', jwtAuth_1.adminRouteProtector, adminController.editUser);
adminRouter.delete('/delete-user/:userId', jwtAuth_1.adminRouteProtector, adminController.deleteUser);
adminRouter.get('/logout', jwtAuth_1.adminRouteProtector, adminController.logout);
adminRouter.get('/refresh-token', jwtAuth_1.refreshToken);
exports.default = adminRouter;
