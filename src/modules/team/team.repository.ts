import { FilterQuery, UpdateQuery } from 'mongoose';
import { Team, ITeam } from './team.model';

export class TeamRepository {
  async findById(id: string): Promise<ITeam | null> {
    return Team.findOne({ _id: id, isDeleted: false })
      .populate('manager', 'name email avatar')
      .populate('coach', 'name email avatar');
  }

  async create(data: Partial<ITeam>): Promise<ITeam> {
    return Team.create(data);
  }

  async update(id: string, data: UpdateQuery<ITeam>): Promise<ITeam | null> {
    return Team.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
      new: true,
      runValidators: true,
    })
      .populate('manager', 'name email avatar')
      .populate('coach', 'name email avatar');
  }

  async softDelete(id: string, deletedBy: string): Promise<ITeam | null> {
    return Team.findOneAndUpdate(
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
    search?: string;
    manager?: string;
    coach?: string;
    status?: string;
    showDeleted?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ITeam> = {};
    if (query.showDeleted === 'true') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    if (query.manager) {
      filter.manager = query.manager;
    }

    if (query.coach) {
      filter.coach = query.coach;
    }

    if (query.status) {
      filter.status = query.status;
    }

    const sortField = query.sort || 'createdAt';
    const sortOrder = query.order === 'desc' ? -1 : 1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const total = await Team.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await Team.find(filter)
      .populate('manager', 'name email avatar')
      .populate('coach', 'name email avatar')
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

export const teamRepository = new TeamRepository();
export default teamRepository;
