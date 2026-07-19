import { teamRepository } from './team.repository';
import { Team, ITeam } from './team.model';
import { AppError } from '../../utils/AppError';
import { User } from '../user/user.model';

export class TeamService {
  async createTeam(data: Partial<ITeam>, userId: string): Promise<ITeam> {
    // Verify unique name
    const existing = await teamRepository.findAll({ search: data.name });
    const isDuplicate = existing.data.some((t) => t.name.toLowerCase() === data.name?.toLowerCase());
    if (isDuplicate) {
      throw new AppError(409, 'Team name is already registered');
    }

    // Verify manager exists and has appropriate role
    if (data.manager) {
      const managerUser = await User.findOne({ _id: data.manager, isDeleted: false });
      if (!managerUser) {
        throw new AppError(404, 'Manager user not found');
      }
      if (managerUser.role !== 'Team Manager' && managerUser.role !== 'Super Admin' && managerUser.role !== 'Organizer') {
        throw new AppError(400, 'Assigned user does not have Team Manager role privileges');
      }
    }

    // Verify coach exists
    if (data.coach) {
      const coachUser = await User.findOne({ _id: data.coach, isDeleted: false });
      if (!coachUser) {
        throw new AppError(404, 'Coach user not found');
      }
    }

    return teamRepository.create({
      ...data,
      createdBy: userId,
    });
  }

  async getTeamById(id: string): Promise<ITeam> {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new AppError(404, 'Team not found');
    }
    return team;
  }

  async getAllTeams(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    manager?: string;
    coach?: string;
    status?: string;
  }) {
    return teamRepository.findAll(query);
  }

  async updateTeam(id: string, data: Partial<ITeam>, userId: string): Promise<ITeam> {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new AppError(404, 'Team not found');
    }

    if (data.name) {
      const existing = await teamRepository.findAll({ search: data.name });
      const isDuplicate = existing.data.some(
        (t) => t.name.toLowerCase() === data.name?.toLowerCase() && t.id !== id
      );
      if (isDuplicate) {
        throw new AppError(409, 'Team name is already in use by another team');
      }
    }

    if (data.manager) {
      const managerUser = await User.findOne({ _id: data.manager, isDeleted: false });
      if (!managerUser) {
        throw new AppError(404, 'Manager user not found');
      }
    }

    if (data.coach) {
      const coachUser = await User.findOne({ _id: data.coach, isDeleted: false });
      if (!coachUser) {
        throw new AppError(404, 'Coach user not found');
      }
    }

    const updated = await teamRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    if (!updated) {
      throw new AppError(400, 'Could not update team');
    }

    return updated;
  }

  async deleteTeam(id: string, userId: string): Promise<void> {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new AppError(404, 'Team not found');
    }

    await teamRepository.softDelete(id, userId);
  }

  async restoreTeam(id: string, updatedBy: string): Promise<ITeam> {
    const team = await Team.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, updatedBy },
      { new: true }
    );
    if (!team) {
      throw new AppError(404, 'Deleted team not found');
    }
    return team;
  }

  async bulkDeleteTeams(ids: string[], deletedBy: string): Promise<any> {
    return Team.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { isDeleted: true, updatedBy: deletedBy }
    );
  }

  async bulkUpdateTeams(ids: string[], updateData: any, updatedBy: string): Promise<any> {
    return Team.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { ...updateData, updatedBy }
    );
  }
}

export const teamService = new TeamService();
export default teamService;
