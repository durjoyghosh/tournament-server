import { matchRepository } from './match.repository';
import { IMatch, IMatchEvent } from './match.model';
import { AppError } from '../../utils/AppError';
import { Tournament } from '../tournament/tournament.model';
import { Team } from '../team/team.model';
import { User } from '../user/user.model';
import { socketService } from '../../socket/socket.service';

export class MatchService {
  async createMatch(data: Partial<IMatch>, userId: string): Promise<IMatch> {
    // 1) Verify tournament exists
    const tournament = await Tournament.findOne({ _id: data.tournament, isDeleted: false });
    if (!tournament) {
      throw new AppError(404, 'Tournament not found');
    }

    // 2) Verify home and away teams exist and belong to the tournament
    if (data.homeTeam === data.awayTeam) {
      throw new AppError(400, 'Home team and away team must be different');
    }

    const homeTeam = await Team.findOne({ _id: data.homeTeam, isDeleted: false });
    const awayTeam = await Team.findOne({ _id: data.awayTeam, isDeleted: false });

    if (!homeTeam || !awayTeam) {
      throw new AppError(404, 'One or both teams not found');
    }

    // Verify referee if provided
    if (data.referee) {
      const refereeUser = await User.findOne({ _id: data.referee, isDeleted: false });
      if (!refereeUser) {
        throw new AppError(404, 'Referee user not found');
      }
      if (refereeUser.role !== 'Referee' && refereeUser.role !== 'Super Admin') {
        throw new AppError(400, 'Assigned user does not have Referee role privileges');
      }
    }

    return matchRepository.create({
      ...data,
      createdBy: userId,
    });
  }

  async getMatchById(id: string): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }
    return match;
  }

  async getAllMatches(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    tournament?: string;
    team?: string;
    referee?: string;
    status?: string;
    showDeleted?: string;
  }) {
    return matchRepository.findAll(query);
  }

  async updateMatch(id: string, data: Partial<IMatch>, userId: string): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    if (data.referee) {
      const refereeUser = await User.findOne({ _id: data.referee, isDeleted: false });
      if (!refereeUser) {
        throw new AppError(404, 'Referee user not found');
      }
    }

    const updated = await matchRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    if (!updated) {
      throw new AppError(400, 'Could not update match');
    }

    return updated;
  }

  async deleteMatch(id: string, userId: string): Promise<void> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    await matchRepository.softDelete(id, userId);
  }

  async restoreMatch(id: string): Promise<IMatch> {
    const restored = await matchRepository.restore(id);
    if (!restored) {
      throw new AppError(404, 'Match not found or not deleted');
    }
    return restored;
  }

  async bulkDeleteMatches(ids: string[], userId: string): Promise<void> {
    await matchRepository.bulkDelete(ids, userId);
  }

  async updateLiveScore(
    id: string,
    score: { homeTeam: number; awayTeam: number },
    newEvent?: IMatchEvent,
    userId?: string
  ): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const updateQuery: any = {
      score,
      status: 'live',
      updatedBy: userId,
    };

    if (newEvent) {
      updateQuery.$push = { events: newEvent };
    }

    const updated = await matchRepository.update(id, updateQuery);
    if (!updated) {
      throw new AppError(400, 'Could not update live score');
    }

    // Emit Realtime Socket update
    socketService.emitToMatch(id, 'scoreUpdate', {
      matchId: id,
      score: updated.score,
      status: updated.status,
      events: updated.events,
    });

    socketService.emitToTournament(updated.tournament.toString(), 'tournamentScoreUpdate', {
      matchId: id,
      score: updated.score,
      status: updated.status,
    });

    return updated;
  }

  async endMatch(id: string, score: { homeTeam: number; awayTeam: number }, userId: string): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const updated = await matchRepository.update(id, {
      score,
      status: 'completed',
      updatedBy: userId,
      $push: {
        events: {
          type: 'period_end',
          minute: 90,
          details: 'Full Time - Match completed',
        },
      },
    });

    if (!updated) {
      throw new AppError(400, 'Could not end match');
    }

    // Emit socket update
    socketService.emitToMatch(id, 'matchFinished', {
      matchId: id,
      score: updated.score,
      status: updated.status,
    });

    socketService.emitToTournament(updated.tournament.toString(), 'tournamentMatchFinished', {
      matchId: id,
      score: updated.score,
      status: updated.status,
    });

    return updated;
  }

  async addMatchEvent(
    id: string,
    event: IMatchEvent,
    score?: { homeTeam: number; awayTeam: number },
    minute?: number,
    userId?: string
  ): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const updateQuery: any = {
      $push: { events: event },
      updatedBy: userId,
    };

    if (score) {
      updateQuery.score = score;
    }
    if (typeof minute === 'number') {
      updateQuery.minute = minute;
    }

    const updated = await matchRepository.update(id, updateQuery);
    if (!updated) {
      throw new AppError(400, 'Could not add match event');
    }

    socketService.emitToMatch(id, 'eventAdded', {
      matchId: id,
      event,
      score: updated.score,
      minute: updated.minute,
    });

    return updated;
  }

  async updateRefereeStatus(
    id: string,
    refereeId: string,
    status: 'accepted' | 'rejected',
    reason?: string
  ): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const matchRefereeId = typeof match.referee === 'object' && match.referee ? match.referee._id.toString() : match.referee?.toString();
    if (matchRefereeId !== refereeId) {
      throw new AppError(403, 'You are not assigned as the referee for this match');
    }

    const details = reason ? `Status changed to ${status}. Reason: ${reason}` : `Status changed to ${status}`;
    const updated = await matchRepository.update(id, {
      refereeStatus: status,
      $push: {
        events: {
          type: 'custom',
          minute: 0,
          details: `Referee Assignment: ${details}`,
        },
      },
    });

    if (!updated) {
      throw new AppError(400, 'Could not update referee status');
    }

    return updated;
  }

  async startMatch(id: string, userId: string): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const updated = await matchRepository.update(id, {
      status: 'live',
      minute: 0,
      updatedBy: userId,
      $push: {
        events: {
          type: 'period_start',
          minute: 0,
          details: 'Match started',
        },
      },
    });

    if (!updated) {
      throw new AppError(400, 'Could not start match');
    }

    socketService.emitToMatch(id, 'matchStarted', {
      matchId: id,
      status: 'live',
    });

    return updated;
  }

  async halftimeMatch(id: string, userId: string): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const updated = await matchRepository.update(id, {
      status: 'halftime',
      updatedBy: userId,
      $push: {
        events: {
          type: 'period_end',
          minute: match.minute || 45,
          details: 'Half-time whistle blown',
        },
      },
    });

    if (!updated) {
      throw new AppError(400, 'Could not pause match for halftime');
    }

    socketService.emitToMatch(id, 'matchHalftime', {
      matchId: id,
      status: 'halftime',
    });

    return updated;
  }

  async submitRefereeReport(id: string, report: string, userId: string): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const updated = await matchRepository.update(id, {
      refereeReport: report,
      updatedBy: userId,
    });

    if (!updated) {
      throw new AppError(400, 'Could not submit referee report');
    }

    return updated;
  }

  async updateLineup(
    id: string,
    side: 'home' | 'away',
    starting: string[],
    substitutes: string[],
    userId: string
  ): Promise<IMatch> {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError(404, 'Match not found');
    }

    const lineupKey = `lineups.${side}`;
    const updated = await matchRepository.update(id, {
      [lineupKey]: { starting, substitutes },
      updatedBy: userId,
    });

    if (!updated) {
      throw new AppError(400, 'Could not update lineup');
    }

    return updated;
  }

  async getMyAssignedMatches(refereeId: string, query: any) {
    return matchRepository.findAll({ ...query, referee: refereeId });
  }

  async getMyScorekeeperMatches(scorekeeperId: string, query: any) {
    return matchRepository.findAll({ ...query, scorekeeper: scorekeeperId });
  }
}

export const matchService = new MatchService();
export default matchService;
