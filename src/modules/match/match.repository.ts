import { FilterQuery, UpdateQuery } from 'mongoose';
import { Match, IMatch } from './match.model';

export class MatchRepository {
  async findById(id: string): Promise<IMatch | null> {
    return Match.findOne({ _id: id, isDeleted: false })
      .populate('tournament', 'name season format')
      .populate('homeTeam', 'name logo')
      .populate('awayTeam', 'name logo')
      .populate('referee', 'name email avatar')
      .populate('events.player', 'jerseyNumber position');
  }

  async create(data: Partial<IMatch>): Promise<IMatch> {
    const created = await Match.create(data);
    return created.populate([
      { path: 'tournament', select: 'name season format' },
      { path: 'homeTeam', select: 'name logo' },
      { path: 'awayTeam', select: 'name logo' },
      { path: 'referee', select: 'name email avatar' },
    ]);
  }

  async update(id: string, data: UpdateQuery<IMatch>): Promise<IMatch | null> {
    return Match.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
      new: true,
      runValidators: true,
    })
      .populate('tournament', 'name season format')
      .populate('homeTeam', 'name logo')
      .populate('awayTeam', 'name logo')
      .populate('referee', 'name email avatar')
      .populate('events.player', 'jerseyNumber position');
  }

  async softDelete(id: string, deletedBy: string): Promise<IMatch | null> {
    return Match.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, updatedBy: deletedBy },
      { new: true }
    );
  }

  async findAll(query: {
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
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IMatch> = query.showDeleted === 'true'
      ? { isDeleted: true }
      : { isDeleted: false };

    if (query.tournament) {
      filter.tournament = query.tournament;
    }

    if (query.team) {
      filter.$or = [{ homeTeam: query.team }, { awayTeam: query.team }];
    }

    if (query.referee) {
      filter.referee = query.referee;
    }

    if (query.status) {
      filter.status = query.status;
    }

    const sortField = query.sort || 'date';
    const sortOrder = query.order === 'desc' ? -1 : 1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const total = await Match.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await Match.find(filter)
      .populate('tournament', 'name season format')
      .populate('homeTeam', 'name logo')
      .populate('awayTeam', 'name logo')
      .populate('referee', 'name email avatar')
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

  async restore(id: string): Promise<IMatch | null> {
    return Match.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async bulkDelete(ids: string[], deletedBy: string): Promise<void> {
    await Match.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { isDeleted: true, updatedBy: deletedBy }
    );
  }
}

export const matchRepository = new MatchRepository();
export default matchRepository;
