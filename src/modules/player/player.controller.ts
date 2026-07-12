import { Request, Response } from 'express';
import { playerService } from './player.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';

export const createPlayer = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const player = await playerService.createPlayer(req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Player profile created successfully',
    data: player,
  });
});

export const getPlayerById = catchAsync(async (req: Request, res: Response) => {
  const player = await playerService.getPlayerById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player profile fetched successfully',
    data: player,
  });
});

export const getMyPlayerProfile = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const player = await playerService.getPlayerByUserId(currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My player profile fetched successfully',
    data: player,
  });
});

export const getAllPlayers = catchAsync(async (req: Request, res: Response) => {
  const result = await playerService.getAllPlayers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Players fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const updatePlayer = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const player = await playerService.updatePlayer(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player profile updated successfully',
    data: player,
  });
});

export const deletePlayer = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  await playerService.deletePlayer(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player profile deleted successfully',
  });
});
