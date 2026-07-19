import { FilterQuery, UpdateQuery } from 'mongoose';
import { User } from './user.model';
import { IUser } from './user.interface';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findOne({ _id: id, isDeleted: false });
  }

  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (includePassword) {
      query.select('+password');
    }
    return query;
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  async update(id: string, updateData: UpdateQuery<IUser>): Promise<IUser | null> {
    return User.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id: string, deletedBy: string): Promise<IUser | null> {
    return User.findOneAndUpdate(
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
    role?: string;
    status?: string;
    showDeleted?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IUser> = {};
    if (query.showDeleted === 'true') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }

    // Search query
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Role filtering
    if (query.role) {
      filter.role = query.role;
    }

    // Status filtering
    if (query.status) {
      filter.status = query.status;
    }

    // Sorting
    const sortField = query.sort || 'createdAt';
    const sortOrder = query.order === 'desc' ? -1 : 1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await User.find(filter)
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

export const userRepository = new UserRepository();
