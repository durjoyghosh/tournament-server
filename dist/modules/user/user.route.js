"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const userController = __importStar(require("./user.controller"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
// ---- Self-service endpoints ----
router.get('/me', auth_middleware_1.protect, userController.getMe);
router.patch('/me', auth_middleware_1.protect, (0, validate_middleware_1.validate)(user_validation_1.updateUserValidationSchema), userController.updateMe);
// ---- Super Admin: User Management ----
router.post('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(user_validation_1.createUserValidationSchema), userController.createUser);
router.get('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer', 'Team Manager', 'Referee', 'Scorekeeper'), (0, validate_middleware_1.validate)(user_validation_1.queryUserValidationSchema), userController.getAllUsers);
router.post('/bulk-delete', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), userController.bulkDeleteUsers);
router.post('/bulk-update', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), userController.bulkUpdateUsers);
router.post('/:id/restore', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema), userController.restoreUser);
router.get('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema), userController.getUserById);
router.patch('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema.merge(user_validation_1.updateUserValidationSchema)), userController.updateUser);
router.delete('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema), userController.deleteUser);
// ---- Super Admin: Suspend / Activate user account ----
router.patch('/:id/status', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema), userController.updateUserStatus);
// ---- Super Admin: Organizer Approval Workflow ----
router.get('/organizers/pending', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), userController.getPendingOrganizers);
router.patch('/organizers/:id/approve', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema), userController.approveOrganizer);
router.patch('/organizers/:id/reject', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), (0, validate_middleware_1.validate)(user_validation_1.userParamsValidationSchema), userController.rejectOrganizer);
// ---- Admin: Platform Analytics ----
router.get('/admin/analytics', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), userController.getPlatformAnalytics);
// ---- Admin: Activity Logs ----
router.get('/admin/logs', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), userController.getActivityLogs);
exports.userRoutes = router;
exports.default = exports.userRoutes;
