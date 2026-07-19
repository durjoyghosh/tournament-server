"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = require("mongoose");
const scoreSchema = new mongoose_1.Schema({
    homeTeam: { type: Number, default: 0 },
    awayTeam: { type: Number, default: 0 },
}, { _id: false });
const eventSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: [
            'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'timeout',
            'period_start', 'period_end', 'corner', 'penalty', 'foul',
            'run', 'wicket', 'over', 'extra',
            'point', 'set_win', 'set_timeout',
            'rebound', 'custom',
        ],
        required: true,
    },
    minute: { type: Number, required: true },
    team: { type: String, enum: ['home', 'away'] },
    player: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Player' },
    details: { type: String, trim: true },
}, { _id: true });
const lineupSideSchema = new mongoose_1.Schema({
    starting: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Player' }],
    substitutes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Player' }],
}, { _id: false });
const lineupSchema = new mongoose_1.Schema({
    home: { type: lineupSideSchema, default: () => ({ starting: [], substitutes: [] }) },
    away: { type: lineupSideSchema, default: () => ({ starting: [], substitutes: [] }) },
}, { _id: false });
const matchSchema = new mongoose_1.Schema({
    tournament: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: [true, 'Please provide the tournament reference'],
    },
    homeTeam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Please provide the home team reference'],
    },
    awayTeam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Please provide the away team reference'],
    },
    venue: {
        type: String,
        trim: true,
    },
    referee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    scorekeeper: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        required: [true, 'Please provide the match date'],
    },
    round: {
        type: String,
        trim: true,
        default: 'Group Stage',
    },
    status: {
        type: String,
        enum: ['scheduled', 'live', 'halftime', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    refereeStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    refereeReport: {
        type: String,
        default: '',
    },
    score: {
        type: scoreSchema,
        default: () => ({ homeTeam: 0, awayTeam: 0 }),
    },
    events: {
        type: [eventSchema],
        default: [],
    },
    lineups: {
        type: lineupSchema,
        default: () => ({
            home: { starting: [], substitutes: [] },
            away: { starting: [], substitutes: [] },
        }),
    },
    minute: {
        type: Number,
        default: 0,
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
matchSchema.index({ isDeleted: 1, status: 1 });
matchSchema.index({ tournament: 1 });
matchSchema.index({ homeTeam: 1, awayTeam: 1 });
matchSchema.index({ referee: 1, refereeStatus: 1 });
matchSchema.index({ scorekeeper: 1 });
exports.Match = (0, mongoose_1.model)('Match', matchSchema);
exports.default = exports.Match;
