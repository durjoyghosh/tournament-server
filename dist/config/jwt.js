"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const env_1 = require("./env");
exports.jwtConfig = {
    accessSecret: env_1.env.JWT_ACCESS_SECRET,
    accessTokenExpiry: env_1.env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: env_1.env.JWT_REFRESH_SECRET,
    refreshTokenExpiry: env_1.env.JWT_REFRESH_EXPIRES_IN,
};
