"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudinaryConfigured = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const env_1 = require("./env");
const isCloudinaryConfigured = !!(env_1.env.CLOUDINARY_CLOUD_NAME &&
    env_1.env.CLOUDINARY_API_KEY &&
    env_1.env.CLOUDINARY_API_SECRET);
exports.isCloudinaryConfigured = isCloudinaryConfigured;
if (isCloudinaryConfigured) {
    cloudinary_1.v2.config({
        cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.env.CLOUDINARY_API_KEY,
        api_secret: env_1.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    console.log('☁️ Cloudinary configured successfully.');
}
else {
    console.warn('⚠️ Cloudinary credentials are not configured. Image uploads will not be processed.');
}
