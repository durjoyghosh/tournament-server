"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateUsers = exports.bulkDeleteUsers = exports.restoreUser = exports.getActivityLogs = exports.getPlatformAnalytics = exports.rejectOrganizer = exports.approveOrganizer = exports.getPendingOrganizers = exports.updateUserStatus = exports.updateMe = exports.getMe = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
exports.createUser = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    const user = await user_service_1.userService.createUser(req.body, currentUserId);
    const userObj = user.toObject();
    delete userObj.password;
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'User created successfully',
        data: userObj,
    });
});
exports.getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.userService.getUserById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User fetched successfully',
        data: user,
    });
});
exports.getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.userService.getAllUsers(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const user = await user_service_1.userService.updateUser(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: user,
    });
});
exports.deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    await user_service_1.userService.deleteUser(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
    });
});
exports.getMe = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const user = await user_service_1.userService.getUserById(currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User profile fetched successfully',
        data: user,
    });
});
exports.updateMe = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    // Prevent users from changing their own role or status through generic updateMe
    const { role, status, organizerStatus, ...allowedUpdates } = req.body;
    const user = await user_service_1.userService.updateUser(currentUserId, allowedUpdates, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Profile updated successfully',
        data: user,
    });
});
// ---- Super Admin: Suspend / Activate a user account ----
exports.updateUserStatus = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { status, suspendReason } = req.body;
    if (!status || !['active', 'inactive'].includes(status)) {
        throw new AppError_1.AppError(400, 'Status must be "active" or "inactive"');
    }
    const user = await user_service_1.userService.updateUserStatus(req.params.id, status, suspendReason, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
        data: user,
    });
});
// ---- Super Admin: Get all pending organizer requests ----
exports.getPendingOrganizers = (0, catchAsync_1.default)(async (_req, res) => {
    const organizers = await user_service_1.userService.getPendingOrganizers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Pending organizer applications fetched successfully',
        data: organizers,
    });
});
// ---- Super Admin: Approve an organizer application ----
exports.approveOrganizer = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const user = await user_service_1.userService.approveOrganizer(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Organizer approved successfully',
        data: user,
    });
});
// ---- Super Admin: Reject an organizer application ----
exports.rejectOrganizer = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { reason } = req.body;
    const user = await user_service_1.userService.rejectOrganizer(req.params.id, currentUserId, reason);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Organizer application rejected',
        data: user,
    });
});
// ---- Super Admin: Platform-wide analytics ----
exports.getPlatformAnalytics = (0, catchAsync_1.default)(async (_req, res) => {
    const analytics = await user_service_1.userService.getPlatformAnalytics();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Platform analytics fetched successfully',
        data: analytics,
    });
});
// ---- Super Admin: Activity logs ----
exports.getActivityLogs = (0, catchAsync_1.default)(async (req, res) => {
    const logs = await user_service_1.userService.getActivityLogs(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Activity logs fetched successfully',
        data: logs.data,
        meta: logs.meta,
    });
});
exports.restoreUser = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const user = await user_service_1.userService.restoreUser(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User restored successfully',
        data: user,
    });
});
exports.bulkDeleteUsers = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids } = req.body;
    await user_service_1.userService.bulkDeleteUsers(ids, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Users bulk deleted successfully',
    });
});
exports.bulkUpdateUsers = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids, data } = req.body;
    await user_service_1.userService.bulkUpdateUsers(ids, data, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Users bulk updated successfully',
    });
});
