import { Request, Response } from 'express';
import { userService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  const user = await userService.createUser(req.body, currentUserId);

  const userObj = user.toObject();
  delete userObj.password;

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: userObj,
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: user,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const user = await userService.updateUser(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  await userService.deleteUser(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const user = await userService.getUserById(currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully',
    data: user,
  });
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  // Prevent users from changing their own role or status through generic updateMe
  const { role, status, organizerStatus, ...allowedUpdates } = req.body;

  const user = await userService.updateUser(currentUserId, allowedUpdates, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

// ---- Super Admin: Suspend / Activate a user account ----
export const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { status, suspendReason } = req.body;
  if (!status || !['active', 'inactive'].includes(status)) {
    throw new AppError(400, 'Status must be "active" or "inactive"');
  }

  const user = await userService.updateUserStatus(req.params.id, status, suspendReason, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
    data: user,
  });
});

// ---- Super Admin: Get all pending organizer requests ----
export const getPendingOrganizers = catchAsync(async (_req: Request, res: Response) => {
  const organizers = await userService.getPendingOrganizers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending organizer applications fetched successfully',
    data: organizers,
  });
});

// ---- Super Admin: Approve an organizer application ----
export const approveOrganizer = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const user = await userService.approveOrganizer(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Organizer approved successfully',
    data: user,
  });
});

// ---- Super Admin: Reject an organizer application ----
export const rejectOrganizer = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { reason } = req.body;
  const user = await userService.rejectOrganizer(req.params.id, currentUserId, reason);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Organizer application rejected',
    data: user,
  });
});

// ---- Super Admin: Platform-wide analytics ----
export const getPlatformAnalytics = catchAsync(async (_req: Request, res: Response) => {
  const analytics = await userService.getPlatformAnalytics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Platform analytics fetched successfully',
    data: analytics,
  });
});

// ---- Super Admin: Activity logs ----
export const getActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const logs = await userService.getActivityLogs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity logs fetched successfully',
    data: logs.data,
    meta: logs.meta,
  });
});

export const restoreUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const user = await userService.restoreUser(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User restored successfully',
    data: user,
  });
});

export const bulkDeleteUsers = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { ids } = req.body;
  await userService.bulkDeleteUsers(ids, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users bulk deleted successfully',
  });
});

export const bulkUpdateUsers = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { ids, data } = req.body;
  await userService.bulkUpdateUsers(ids, data, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users bulk updated successfully',
  });
});

