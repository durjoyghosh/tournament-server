import { userRepository } from './user.repository';
import { IUser } from './user.interface';
import { AppError } from '../../utils/AppError';
import { UpdateQuery } from 'mongoose';
import { User } from './user.model';
import { Tournament } from '../tournament/tournament.model';
import { Team } from '../team/team.model';
import { Player } from '../player/player.model';
import { Match } from '../match/match.model';

export class UserService {
  async createUser(userData: Partial<IUser>, createdBy?: string): Promise<IUser> {
    const existingUser = await userRepository.findByEmail(userData.email || '');
    if (existingUser) {
      throw new AppError(409, 'Email is already registered');
    }

    // Organizers start as pending until Super Admin approves
    const finalData: Partial<IUser> = { ...userData, createdBy };
    if (userData.role === 'Organizer') {
      finalData.organizerStatus = 'pending';
    }

    return userRepository.create(finalData);
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async getAllUsers(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    role?: string;
    status?: string;
  }) {
    return userRepository.findAll(query);
  }

  async updateUser(id: string, updateData: UpdateQuery<IUser>, updatedBy: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (updateData.email) {
      const emailUser = await userRepository.findByEmail(updateData.email);
      if (emailUser && emailUser.id !== id) {
        throw new AppError(409, 'Email is already in use by another user');
      }
    }

    const updatedUser = await userRepository.update(id, {
      ...updateData,
      updatedBy,
    });

    if (!updatedUser) {
      throw new AppError(400, 'Could not update user');
    }

    return updatedUser;
  }

  async deleteUser(id: string, deletedBy: string): Promise<void> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await userRepository.softDelete(id, deletedBy);
  }

  async updateUserStatus(id: string, status: 'active' | 'inactive', suspendReason: string | undefined, updatedBy: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updatedUser = await userRepository.update(id, {
      status,
      suspendReason: suspendReason || '',
      updatedBy,
    });

    if (!updatedUser) {
      throw new AppError(400, 'Could not update user status');
    }

    return updatedUser;
  }

  async getPendingOrganizers(): Promise<IUser[]> {
    return User.find({ role: 'Organizer', organizerStatus: 'pending', isDeleted: false });
  }

  async approveOrganizer(id: string, updatedBy: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    if (user.role !== 'Organizer') {
      throw new AppError(400, 'User is not an organizer');
    }

    const updatedUser = await userRepository.update(id, {
      organizerStatus: 'approved',
      status: 'active',
      updatedBy,
    });

    if (!updatedUser) {
      throw new AppError(400, 'Could not approve organizer');
    }

    return updatedUser;
  }

  async rejectOrganizer(id: string, updatedBy: string, reason?: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    if (user.role !== 'Organizer') {
      throw new AppError(400, 'User is not an organizer');
    }

    const updatedUser = await userRepository.update(id, {
      organizerStatus: 'rejected',
      suspendReason: reason || 'Application rejected by Super Admin',
      updatedBy,
    });

    if (!updatedUser) {
      throw new AppError(400, 'Could not reject organizer');
    }

    return updatedUser;
  }

  async getPlatformAnalytics() {
    const [
      totalUsers,
      totalOrganizers,
      pendingOrganizers,
      totalTournaments,
      liveTournaments,
      totalTeams,
      totalPlayers,
      totalMatches,
      liveMatches,
      completedMatches,
      usersByRole,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: 'Organizer', isDeleted: false }),
      User.countDocuments({ role: 'Organizer', organizerStatus: 'pending', isDeleted: false }),
      Tournament.countDocuments({ isDeleted: false }),
      Tournament.countDocuments({ status: 'live', isDeleted: false }),
      Team.countDocuments({ isDeleted: false }),
      Player.countDocuments({ isDeleted: false }),
      Match.countDocuments({ isDeleted: false }),
      Match.countDocuments({ status: 'live', isDeleted: false }),
      Match.countDocuments({ status: 'completed', isDeleted: false }),
      User.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      users: {
        total: totalUsers,
        organizers: totalOrganizers,
        pendingOrganizers,
        byRole: usersByRole,
      },
      tournaments: {
        total: totalTournaments,
        live: liveTournaments,
      },
      teams: { total: totalTeams },
      players: { total: totalPlayers },
      matches: {
        total: totalMatches,
        live: liveMatches,
        completed: completedMatches,
      },
    };
  }

  async getActivityLogs(query: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    // Return recently updated users as a proxy for activity logs
    const total = await User.countDocuments({ isDeleted: false });
    const data = await User.find({ isDeleted: false })
      .select('name email role status organizerStatus updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async restoreUser(id: string, updatedBy: string): Promise<IUser> {
    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, updatedBy },
      { new: true }
    );
    if (!user) {
      throw new AppError(404, 'Deleted user not found');
    }
    return user;
  }

  async bulkDeleteUsers(ids: string[], deletedBy: string): Promise<any> {
    return User.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { isDeleted: true, updatedBy: deletedBy }
    );
  }

  async bulkUpdateUsers(ids: string[], updateData: any, updatedBy: string): Promise<any> {
    return User.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { ...updateData, updatedBy }
    );
  }
}

export const userService = new UserService();
export default userService;
