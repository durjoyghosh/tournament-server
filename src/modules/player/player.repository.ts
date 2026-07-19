import { FilterQuery, UpdateQuery } from 'mongoose';
import { Player, IPlayer } from './player.model';

export class PlayerRepository {
  async findById(id: string): Promise<IPlayer | null> {
    return Player.findOne({ _id: id, isDeleted: false })
      .populate('user', 'name email avatar phoneNumber')
      .populate('team', 'name logo');
  }

  async findByUserId(userId: string): Promise<IPlayer | null> {
    return Player.findOne({ user: userId, isDeleted: false })
      .populate('user', 'name email avatar phoneNumber')
      .populate('team', 'name logo');
  }

  async create(data: Partial<IPlayer>): Promise<IPlayer> {
    const created = await Player.create(data);
    return created.populate([
      { path: 'user', select: 'name email avatar phoneNumber' },
      { path: 'team', select: 'name logo' }
    ]);
  }

  async update(id: string, data: UpdateQuery<IPlayer>): Promise<IPlayer | null> {
    return Player.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email avatar phoneNumber')
      .populate('team', 'name logo');
  }

  async softDelete(id: string, deletedBy: string): Promise<IPlayer | null> {
    return Player.findOneAndUpdate(
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
    team?: string;
    status?: string;
    search?: string;
    showDeleted?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IPlayer> = {};
    if (query.showDeleted === 'true') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }

    if (query.team) {
      filter.team = query.team;
    }

    if (query.status) {
      filter.status = query.status;
    }

    // Dynamic search matches by looking up the populated user name
    let userFilterIds: string[] = [];
    if (query.search) {
      // Find matching user IDs
      const mongoose = require('mongoose');
      const User = mongoose.model('User');
      const users = await User.find({
        name: { $regex: query.search, $options: 'i' },
        isDeleted: false,
      }).select('_id');
      userFilterIds = users.map((u: any) => u._id);
      filter.user = { $in: userFilterIds };
    }

    const sortField = query.sort || 'createdAt';
    const sortOrder = query.order === 'desc' ? -1 : 1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const total = await Player.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await Player.find(filter)
      .populate('user', 'name email avatar phoneNumber')
      .populate('team', 'name logo')
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

export const playerRepository = new PlayerRepository();
export default playerRepository;
