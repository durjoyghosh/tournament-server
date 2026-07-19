"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Organizer', 'Team Manager', 'Coach', 'Player', 'Referee', 'Scorekeeper', 'Spectator'],
        default: 'Spectator',
    },
    organizerStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    suspendReason: {
        type: String,
        default: '',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for performance
userSchema.index({ isDeleted: 1, status: 1 });
userSchema.index({ role: 1, organizerStatus: 1 });
// Document Middleware - Hashing password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    if (this.password) {
        this.password = await bcryptjs_1.default.hash(this.password, 12);
    }
    next();
});
// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.default = exports.User;
