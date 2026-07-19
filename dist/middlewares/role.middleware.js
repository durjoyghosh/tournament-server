"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const AppError_1 = require("../utils/AppError");
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError(401, 'You are not authenticated.'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError(403, `Forbidden: You do not have permission to perform this action. Required: [${roles.join(', ')}]`));
        }
        next();
    };
};
exports.authorize = authorize;
exports.default = exports.authorize;
