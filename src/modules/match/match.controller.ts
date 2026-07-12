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
