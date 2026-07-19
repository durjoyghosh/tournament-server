import { Request, Response } from 'express';
import { matchService } from './match.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';

export const createMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const match = await matchService.createMatch(req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Match scheduled successfully',
    data: match,
  });
});

export const getMatchById = catchAsync(async (req: Request, res: Response) => {
  const match = await matchService.getMatchById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match fetched successfully',
    data: match,
  });
});

export const getAllMatches = catchAsync(async (req: Request, res: Response) => {
  const result = await matchService.getAllMatches(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Matches fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const updateMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const match = await matchService.updateMatch(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match updated successfully',
    data: match,
  });
});

export const deleteMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  await matchService.deleteMatch(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match deleted successfully',
  });
});

export const updateLiveScore = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { score, event } = req.body;
  const match = await matchService.updateLiveScore(req.params.id, score, event, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Live score updated successfully',
    data: match,
  });
});

export const endMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { score } = req.body;
  const match = await matchService.endMatch(req.params.id, score, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match ended and finalized successfully',
    data: match,
  });
});

export const addMatchEvent = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { event, score, minute } = req.body;
  const match = await matchService.addMatchEvent(req.params.id, event, score, minute, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match event added successfully',
    data: match,
  });
});

export const updateRefereeStatus = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { status, reason } = req.body;
  const match = await matchService.updateRefereeStatus(req.params.id, currentUserId, status, reason);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referee status updated successfully',
    data: match,
  });
});

export const startMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const match = await matchService.startMatch(req.params.id, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match started successfully',
    data: match,
  });
});

export const halftimeMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const match = await matchService.halftimeMatch(req.params.id, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match halftime set successfully',
    data: match,
  });
});

export const submitRefereeReport = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { report } = req.body;
  const match = await matchService.submitRefereeReport(req.params.id, report, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referee report submitted successfully',
    data: match,
  });
});

export const updateLineup = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { side, starting, substitutes } = req.body;
  const match = await matchService.updateLineup(req.params.id, side, starting, substitutes, currentUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Lineup updated successfully',
    data: match,
  });
});

export const getMyAssignedMatches = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const result = await matchService.getMyAssignedMatches(currentUserId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assigned matches fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const getMyScorekeeperMatches = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const result = await matchService.getMyScorekeeperMatches(currentUserId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Scorekeeper matches fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const restoreMatch = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const match = await matchService.restoreMatch(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match restored successfully',
    data: match,
  });
});

export const bulkDeleteMatches = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { ids } = req.body;
  await matchService.bulkDeleteMatches(ids, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Matches bulk deleted successfully',
  });
});


