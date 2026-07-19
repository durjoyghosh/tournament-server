"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sport = void 0;
const mongoose_1 = require("mongoose");
const sportSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the sport name'],
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['team', 'individual'],
        default: 'team',
    },
    rules: {
        type: String,
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
});
sportSchema.index({ isDeleted: 1, status: 1 });
exports.Sport = (0, mongoose_1.model)('Sport', sportSchema);
exports.default = exports.Sport;
