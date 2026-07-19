"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const getTimestamp = () => {
    return new Date().toISOString();
};
exports.logger = {
    info: (message, ...meta) => {
        console.log(`[${getTimestamp()}] ℹ️ [INFO]: ${message}`, ...meta);
    },
    warn: (message, ...meta) => {
        console.warn(`[${getTimestamp()}] ⚠️ [WARN]: ${message}`, ...meta);
    },
    error: (message, ...meta) => {
        console.error(`[${getTimestamp()}] ❌ [ERROR]: ${message}`, ...meta);
    },
    debug: (message, ...meta) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[${getTimestamp()}] 🔍 [DEBUG]: ${message}`, ...meta);
        }
    },
};
exports.default = exports.logger;
