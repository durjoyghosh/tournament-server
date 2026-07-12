import { Request, Response } from 'express';
import { tournamentService } from './tournament.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';

export const createSport = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const sport = await tournamentService.createSport(req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Sport created successfully',
    data: sport,
  });
});

export const getAllSports = catchAsync(async (req: Request, res: Response) => {
  const sports = await tournamentService.getAllSports(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sports fetched successfully',
    data: sports,
  });
});

export const updateSport = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const sport = await tournamentService.updateSport(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sport updated successfully',
    data: sport,
  });
});

export const createTournament = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.createTournament(req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Tournament created successfully',
    data: tournament,
  });
});

export const getTournamentById = catchAsync(async (req: Request, res: Response) => {
  const tournament = await tournamentService.getTournamentById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tournament fetched successfully',
    data: tournament,
  });
});

export const getAllTournaments = catchAsync(async (req: Request, res: Response) => {
  const result = await tournamentService.getAllTournaments(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tournaments fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const updateTournament = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.updateTournament(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tournament updated successfully',
    data: tournament,
  });
});

export const deleteTournament = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  await tournamentService.deleteTournament(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tournament deleted successfully',
  });
});

export const publishTournament = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.publishTournament(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tournament published successfully',
    data: tournament,
  });
});

export const archiveTournament = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.archiveTournament(req.params.id, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tournament archived successfully',
    data: tournament,
  });
});

export const applyTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.applyTeam(req.params.id, req.body.teamId, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team application submitted successfully. Awaiting organizer approval.',
    data: tournament,
  });
});

export const approveTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.approveTeam(req.params.id, req.params.teamId, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team approved and added to tournament',
    data: tournament,
  });
});

export const rejectTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.rejectTeam(req.params.id, req.params.teamId, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team application rejected',
    data: tournament,
  });
});

export const registerTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.registerTeam(req.params.id, req.body.teamId, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team registered to tournament successfully',
    data: tournament,
  });
});

export const unregisterTeam = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.unregisterTeam(req.params.id, req.body.teamId, currentUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team unregistered from tournament successfully',
    data: tournament,
  });
});

export const generateFixtures = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const matches = await tournamentService.generateFixtures(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `${matches.length} fixture(s) generated successfully`,
    data: matches,
  });
});

export const addAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.addAnnouncement(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Announcement published successfully',
    data: tournament,
  });
});

export const addSponsor = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const tournament = await tournamentService.addSponsor(req.params.id, req.body, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Sponsor added successfully',
    data: tournament,
  });
});

export const addGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const { imageUrl } = req.body;
  if (!imageUrl) throw new AppError(400, 'imageUrl is required');

  const tournament = await tournamentService.addGalleryItem(req.params.id, imageUrl, currentUserId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Gallery item added successfully',
    data: tournament,
  });
});

export const getMyTournaments = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  if (!currentUserId) throw new AppError(401, 'Unauthorized');

  const result = await tournamentService.getMyTournaments(currentUserId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Your tournaments fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});
