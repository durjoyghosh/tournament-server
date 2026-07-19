"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const user_repository_1 = require("../user/user.repository");
const user_service_1 = require("../user/user.service");
const AppError_1 = require("../../utils/AppError");
const jwt_1 = require("../../config/jwt");
const crypto_1 = require("../../utils/crypto");
class AuthService {
    generateTokenPair(user) {
        const payload = {
            id: user.id || user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.accessSecret, {
            expiresIn: jwt_1.jwtConfig.accessTokenExpiry,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.refreshSecret, {
            expiresIn: jwt_1.jwtConfig.refreshTokenExpiry,
        });
        return { accessToken, refreshToken };
    }
    async register(userData) {
        const newUser = await user_service_1.userService.createUser(userData);
        const tokens = this.generateTokenPair(newUser);
        return {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                avatar: newUser.avatar,
            },
            ...tokens,
        };
    }
    async login(email, password) {
        const user = await user_repository_1.userRepository.findByEmail(email, true);
        if (!user) {
            throw new AppError_1.AppError(401, 'Invalid email or password');
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new AppError_1.AppError(401, 'Invalid email or password');
        }
        if (user.status === 'inactive') {
            throw new AppError_1.AppError(403, 'Your account is deactivated');
        }
        const tokens = this.generateTokenPair(user);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
            ...tokens,
        };
    }
    async refresh(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, jwt_1.jwtConfig.refreshSecret);
            const user = await user_repository_1.userRepository.findById(decoded.id);
            if (!user || user.status === 'inactive') {
                throw new AppError_1.AppError(401, 'User no longer exists or is inactive');
            }
            // Generate a new token pair for rotation
            const tokens = this.generateTokenPair(user);
            return tokens;
        }
        catch (error) {
            throw new AppError_1.AppError(401, 'Invalid or expired refresh token. Please login again');
        }
    }
    async forgotPassword(email) {
        const user = await user_model_1.User.findOne({ email: email.toLowerCase(), isDeleted: false });
        if (!user) {
            throw new AppError_1.AppError(404, 'There is no user with that email address.');
        }
        const { resetToken, hashedToken } = (0, crypto_1.generateResetToken)();
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await user.save({ validateBeforeSave: false });
        // Returns raw resetToken so it can be used/tested.
        return resetToken;
    }
    async resetPassword(token, newPassword) {
        const hashed = (0, crypto_1.hashToken)(token);
        const user = await user_model_1.User.findOne({
            passwordResetToken: hashed,
            passwordResetExpires: { $gt: new Date() },
            isDeleted: false,
        });
        if (!user) {
            throw new AppError_1.AppError(400, 'Token is invalid or has expired');
        }
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
    }
    async changePassword(userId, oldPass, newPass) {
        const user = await user_model_1.User.findById(userId).select('+password');
        if (!user || user.isDeleted) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        const isMatch = await user.comparePassword(oldPass);
        if (!isMatch) {
            throw new AppError_1.AppError(400, 'Current password is incorrect');
        }
        user.password = newPass;
        await user.save();
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
exports.default = exports.authService;
