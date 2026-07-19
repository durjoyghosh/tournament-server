"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the team name'],
        trim: true,
        unique: true,
        maxlength: [50, 'Team name cannot exceed 50 characters'],
    },
    manager: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the team manager reference'],
    },
    coach: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    captain: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    logo: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        trim: true,
        default: '',
    },
    country: {
        type: String,
        trim: true,
        default: '',
    },
    founded: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
teamSchema.index({ isDeleted: 1, status: 1 });
teamSchema.index({ manager: 1 });
teamSchema.index({ coach: 1 });
exports.Team = (0, mongoose_1.model)('Team', teamSchema);
exports.default = exports.Team;
