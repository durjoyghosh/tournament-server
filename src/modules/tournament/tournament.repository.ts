import { FilterQuery, UpdateQuery } from 'mongoose';
import { Tournament, ITournament, ITournamentAnnouncement, ITournamentSponsor } from './tournament.model';
import { Sport, ISport } from './sport.model';

export class TournamentRepository {
  // --- Sport CRUD Operations ---
  async createSport(data: Partial<ISport>): Promise<ISport> {
    return Sport.create(data);
  }

  async findSportById(id: string): Promise<ISport | null> {
    return Sport.findOne({ _id: id, isDeleted: false });
  }

  async findAllSports(query: { search?: string }) {
    const filter: FilterQuery<ISport> = { isDeleted: false, status: 'active' };
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    return Sport.find(filter);
  }

  async updateSport(id: string, data: UpdateQuery<ISport>): Promise<ISport | null> {
    return Sport.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  }

  // --- Tournament CRUD Operations ---
  async createTournament(data: Partial<ITournament>): Promise<ITournament> {
    return Tournament.create(data);
  }

  async findTournamentById(id: string): Promise<ITournament | null> {
    return Tournament.findOne({ _id: id, isDeleted: false })
      .populate('sport')
      .populate('organizer', 'name email avatar')
      .populate('teams')
      .populate('pendingTeams', 'name logo manager')
      .populate('rejectedTeams', 'name logo');
  }

  async updateTournament(id: string, data: UpdateQuery<ITournament>): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
      .populate('sport')
      .populate('organizer', 'name email avatar')
      .populate('teams');
  }

  async softDeleteTournament(id: string, deletedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, updatedBy: deletedBy },
      { new: true }
    );
  }

  async registerTeam(id: string, teamId: string, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false, teams: { $ne: teamId } },
      { $push: { teams: teamId }, updatedBy },
      { new: true }
    );
  }

  async unregisterTeam(id: string, teamId: string, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $pull: { teams: teamId }, updatedBy },
      { new: true }
    );
  }

  // Team Manager applies - goes to pendingTeams
  async addPendingTeam(id: string, teamId: string, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false, pendingTeams: { $ne: teamId }, teams: { $ne: teamId } },
      { $push: { pendingTeams: teamId }, updatedBy },
      { new: true }
    );
  }

  // Organizer approves: move from pendingTeams → teams
  async movePendingToApproved(id: string, teamId: string, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $pull: { pendingTeams: teamId },
        $push: { teams: teamId },
        updatedBy,
      },
      { new: true }
    );
  }

  // Organizer rejects: move from pendingTeams → rejectedTeams
  async movePendingToRejected(id: string, teamId: string, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $pull: { pendingTeams: teamId },
        $push: { rejectedTeams: teamId },
        updatedBy,
      },
      { new: true }
    );
  }

  async pushAnnouncement(id: string, data: Partial<ITournamentAnnouncement>, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $push: { announcements: { ...data, date: new Date() } }, updatedBy },
      { new: true }
    );
  }

  async pushSponsor(id: string, data: Partial<ITournamentSponsor>, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $push: { sponsors: data }, updatedBy },
      { new: true }
    );
  }

  async pushGalleryItem(id: string, imageUrl: string, updatedBy: string): Promise<ITournament | null> {
    return Tournament.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $push: { gallery: imageUrl }, updatedBy },
      { new: true }
    );
  }

  async findAllTournaments(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    sport?: string;
    status?: string;
    organizer?: string;
    isPublished?: string;
    showDeleted?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ITournament> = {};
    if (query.showDeleted === 'true') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.sport) {
      filter.sport = query.sport;
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.organizer) {
      filter.organizer = query.organizer;
    }
    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished === 'true';
    }

    const sortField = query.sort || 'createdAt';
    const sortOrder = query.order === 'desc' ? -1 : 1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const total = await Tournament.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await Tournament.find(filter)
      .populate('sport')
      .populate('organizer', 'name email avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}

export const tournamentRepository = new TournamentRepository();
