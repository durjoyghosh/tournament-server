"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
    MONGODB_URI: zod_1.z.string().min(1, 'MONGODB_URI is required'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(8, 'JWT_ACCESS_SECRET must be at least 8 characters'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 characters'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
}
exports.env = parsed.data;
