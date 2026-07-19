import { tournamentRepository } from './tournament.repository';
import { Tournament, ITournament, ITournamentAnnouncement, ITournamentSponsor } from './tournament.model';
import { ISport } from './sport.model';
import { AppError } from '../../utils/AppError';
import { Team } from '../team/team.model';
import { Match } from '../match/match.model';

export class TournamentService {
  async createSport(data: Partial<ISport>, userId: string): Promise<ISport> {
    return tournamentRepository.createSport({
      ...data,
      createdBy: userId,
    });
  }

  async getAllSports(query: { search?: string }) {
    return tournamentRepository.findAllSports(query);
  }

  async updateSport(id: string, data: Partial<ISport>, userId: string): Promise<ISport> {
    const updated = await tournamentRepository.updateSport(id, { ...data, updatedBy: userId });
    if (!updated) throw new AppError(404, 'Sport not found');
    return updated;
  }

  async createTournament(data: Partial<ITournament>, userId: string): Promise<ITournament> {
    if (data.sport) {
      const sport = await tournamentRepository.findSportById(data.sport.toString());
      if (!sport) {
        throw new AppError(404, 'Sport not found');
      }
    }

    return tournamentRepository.createTournament({
      ...data,
      organizer: data.organizer || userId,
      createdBy: userId,
    });
  }

  async getTournamentById(id: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) {
      throw new AppError(404, 'Tournament not found');
    }
    return tournament;
  }

  async getAllTournaments(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    sport?: string;
    status?: string;
    organizer?: string;
    isPublished?: string;
  }) {
    return tournamentRepository.findAllTournaments(query);
  }

  async getMyTournaments(organizerId: string, query: { page?: number; limit?: number }) {
    return tournamentRepository.findAllTournaments({
      ...query,
      organizer: organizerId,
    });
  }

  async updateTournament(id: string, data: Partial<ITournament>, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) {
      throw new AppError(404, 'Tournament not found');
    }

    if (data.sport) {
      const sport = await tournamentRepository.findSportById(data.sport.toString());
      if (!sport) {
        throw new AppError(404, 'Sport not found');
      }
    }

    const updatedTournament = await tournamentRepository.updateTournament(id, {
      ...data,
      updatedBy: userId,
    });

    if (!updatedTournament) {
      throw new AppError(400, 'Could not update tournament');
    }

    return updatedTournament;
  }

  async deleteTournament(id: string, userId: string): Promise<void> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) {
      throw new AppError(404, 'Tournament not found');
    }

    await tournamentRepository.softDeleteTournament(id, userId);
  }

  async publishTournament(id: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.updateTournament(id, {
      isPublished: true,
      updatedBy: userId,
    });
    if (!updated) throw new AppError(400, 'Could not publish tournament');
    return updated;
  }

  async archiveTournament(id: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.updateTournament(id, {
      status: 'completed',
      isPublished: false,
      updatedBy: userId,
    });
    if (!updated) throw new AppError(400, 'Could not archive tournament');
    return updated;
  }

  // Team Manager applies to join tournament
  async applyTeam(id: string, teamId: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');
    if (!tournament.isPublished) throw new AppError(400, 'Tournament is not open for registration');

    const team = await Team.findOne({ _id: teamId, isDeleted: false });
    if (!team) throw new AppError(404, 'Team not found');

    const isAlreadyRegistered = tournament.teams.some(t => t.toString() === teamId);
    const isAlreadyPending = tournament.pendingTeams.some(t => t.toString() === teamId);
    if (isAlreadyRegistered || isAlreadyPending) {
      throw new AppError(400, 'Team has already applied or is registered');
    }

    const updated = await tournamentRepository.addPendingTeam(id, teamId, userId);
    if (!updated) throw new AppError(400, 'Could not submit team application');
    return updated;
  }

  // Organizer approves a pending team
  async approveTeam(id: string, teamId: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const isPending = tournament.pendingTeams.some(t => t.toString() === teamId);
    if (!isPending) throw new AppError(400, 'Team is not in the pending list');

    if (tournament.teams.length >= tournament.maxTeams) {
      throw new AppError(400, `Tournament is full (max ${tournament.maxTeams} teams)`);
    }

    const updated = await tournamentRepository.movePendingToApproved(id, teamId, userId);
    if (!updated) throw new AppError(400, 'Could not approve team');
    return updated;
  }

  // Organizer rejects a pending team
  async rejectTeam(id: string, teamId: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.movePendingToRejected(id, teamId, userId);
    if (!updated) throw new AppError(400, 'Could not reject team');
    return updated;
  }

  async registerTeam(id: string, teamId: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const team = await Team.findOne({ _id: teamId, isDeleted: false });
    if (!team) throw new AppError(404, 'Team not found');

    const updated = await tournamentRepository.registerTeam(id, teamId, userId);
    if (!updated) throw new AppError(400, 'Team is already registered in this tournament');
    return updated;
  }

  async unregisterTeam(id: string, teamId: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.unregisterTeam(id, teamId, userId);
    if (!updated) throw new AppError(400, 'Team is not registered in this tournament');
    return updated;
  }

  // Berger Round-Robin Fixture Generator
  async generateFixtures(
    id: string,
    options: { startDate: string; venue?: string; matchIntervalDays?: number },
    userId: string
  ) {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');
    if (tournament.teams.length < 2) throw new AppError(400, 'Need at least 2 teams to generate fixtures');

    const teams = [...tournament.teams.map(t => t.toString())];
    const venue = options.venue || '';
    const intervalDays = options.matchIntervalDays || 3;
    let currentDate = new Date(options.startDate);

    const fixtures: any[] = [];

    if (tournament.format === 'knockout') {
      // Single-elimination: pair teams randomly
      const shuffled = teams.sort(() => Math.random() - 0.5);
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        fixtures.push({
          tournament: id,
          homeTeam: shuffled[i],
          awayTeam: shuffled[i + 1],
          venue,
          date: new Date(currentDate),
          round: 'Round of ' + shuffled.length,
          status: 'scheduled',
          createdBy: userId,
        });
        currentDate = new Date(currentDate.getTime() + intervalDays * 86400000);
      }
    } else {
      // Round-robin (league/hybrid): every team plays each other once
      // Berger algorithm for even number of teams
      const n = teams.length % 2 === 0 ? teams.length : teams.length + 1;
      const rounds = n - 1;
      const half = n / 2;

      // Pad with null (bye) if odd number
      const t = [...teams];
      if (t.length % 2 !== 0) t.push('bye');

      for (let round = 0; round < rounds; round++) {
        for (let i = 0; i < half; i++) {
          const home = t[i];
          const away = t[n - 1 - i];
          if (home !== 'bye' && away !== 'bye') {
            fixtures.push({
              tournament: id,
              homeTeam: home,
              awayTeam: away,
              venue,
              date: new Date(currentDate),
              round: `Round ${round + 1}`,
              status: 'scheduled',
              createdBy: userId,
            });
          }
        }

        currentDate = new Date(currentDate.getTime() + intervalDays * 86400000);

        // Rotate teams (keep first fixed)
        const last = t.pop() as string;
        t.splice(1, 0, last);
      }
    }

    // Save all fixtures to the database
    const created = await Match.insertMany(fixtures);
    return created;
  }

  async addAnnouncement(id: string, data: Partial<ITournamentAnnouncement>, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.pushAnnouncement(id, data, userId);
    if (!updated) throw new AppError(400, 'Could not add announcement');
    return updated;
  }

  async addSponsor(id: string, data: Partial<ITournamentSponsor>, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.pushSponsor(id, data, userId);
    if (!updated) throw new AppError(400, 'Could not add sponsor');
    return updated;
  }

  async addGalleryItem(id: string, imageUrl: string, userId: string): Promise<ITournament> {
    const tournament = await tournamentRepository.findTournamentById(id);
    if (!tournament) throw new AppError(404, 'Tournament not found');

    const updated = await tournamentRepository.pushGalleryItem(id, imageUrl, userId);
    if (!updated) throw new AppError(400, 'Could not add gallery item');
    return updated;
  }

  async restoreTournament(id: string, updatedBy: string): Promise<ITournament> {
    const tournament = await Tournament.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, updatedBy },
      { new: true }
    );
    if (!tournament) {
      throw new AppError(404, 'Deleted tournament not found');
    }
    return tournament;
  }

  async bulkDeleteTournaments(ids: string[], deletedBy: string): Promise<any> {
    return Tournament.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { isDeleted: true, updatedBy: deletedBy }
    );
  }

  async bulkUpdateTournaments(ids: string[], updateData: any, updatedBy: string): Promise<any> {
    return Tournament.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { ...updateData, updatedBy }
    );
  }
}

export const tournamentService = new TournamentService();
export default tournamentService;
