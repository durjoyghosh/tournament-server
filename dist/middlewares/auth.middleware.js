"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../config/jwt");
const user_model_1 = require("../modules/user/user.model");
const protect = async (req, _res, next) => {
    try {
        let token;
        // 1) Get token from Authorization header or cookie
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(new AppError_1.AppError(401, 'You are not logged in! Please log in to get access.'));
        }
        // 2) Verify token
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessSecret);
        // 3) Check if user still exists
        const currentUser = await user_model_1.User.findById(decoded.id).select('+status');
        if (!currentUser) {
            return next(new AppError_1.AppError(401, 'The user belonging to this token no longer exists.'));
        }
        if (currentUser.status === 'inactive' || currentUser.isDeleted) {
            return next(new AppError_1.AppError(401, 'This user account is inactive or deleted.'));
        }
        // 4) Grant access and attach user object
        req.user = {
            id: currentUser.id || currentUser._id.toString(),
            email: currentUser.email,
            role: currentUser.role,
        };
        next();
    }
    catch (error) {
        next(new AppError_1.AppError(401, 'Invalid token. Please log in again!'));
    }
};
exports.protect = protect;
