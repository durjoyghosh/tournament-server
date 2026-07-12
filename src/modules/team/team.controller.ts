import { Request, Response } from 'express';
import { teamService } from './team.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';

export const createTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const team = await teamService.createTeam(req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Team created successfully',
    data: team,
  });
});

export const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const team = await teamService.getTeamById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team fetched successfully',
    data: team,
  });
});

export const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.getAllTeams(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teams fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const team = await teamService.updateTeam(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team updated successfully',
    data: team,
  });
});

export const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  await teamService.deleteTeam(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team deleted successfully',
  });
});
