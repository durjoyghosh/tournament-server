import { playerRepository } from './player.repository';
import { IPlayer } from './player.model';
import { AppError } from '../../utils/AppError';
import { User } from '../user/user.model';
import { Team } from '../team/team.model';

export class PlayerService {
  async createPlayer(data: Partial<IPlayer>, userId: string): Promise<IPlayer> {
    // Verify linked user account exists
    const targetUser = await User.findOne({ _id: data.user, isDeleted: false });
    if (!targetUser) {
      throw new AppError(404, 'Linked user profile not found');
    }

    // Verify user doesn't already have a Player profile
    const existingPlayer = await playerRepository.findByUserId(data.user!.toString());
    if (existingPlayer) {
      throw new AppError(409, 'This user already has a player profile');
    }

    // Set user role to Player if it wasn't already
    if (targetUser.role !== 'Player') {
      targetUser.role = 'Player';
      await targetUser.save({ validateBeforeSave: false });
    }

    // Verify team exists if provided
    if (data.team) {
      const team = await Team.findOne({ _id: data.team, isDeleted: false });
      if (!team) {
        throw new AppError(404, 'Team not found');
      }
    }

    return playerRepository.create({
      ...data,
      createdBy: userId,
    });
  }

  async getPlayerById(id: string): Promise<IPlayer> {
    const player = await playerRepository.findById(id);
    if (!player) {
      throw new AppError(404, 'Player profile not found');
    }
    return player;
  }

  async getPlayerByUserId(userId: string): Promise<IPlayer> {
    const player = await playerRepository.findByUserId(userId);
    if (!player) {
      throw new AppError(404, 'Player profile not found for this user');
    }
    return player;
  }

  async getAllPlayers(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    team?: string;
    status?: string;
    search?: string;
  }) {
    return playerRepository.findAll(query);
  }

  async updatePlayer(id: string, data: Partial<IPlayer>, userId: string): Promise<IPlayer> {
    const player = await playerRepository.findById(id);
    if (!player) {
      throw new AppError(404, 'Player profile not found');
    }

    if (data.team) {
      const team = await Team.findOne({ _id: data.team, isDeleted: false });
      if (!team) {
        throw new AppError(404, 'Team not found');
      }
    }

    const updated = await playerRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    if (!updated) {
      throw new AppError(400, 'Could not update player profile');
    }

    return updated;
  }

  async deletePlayer(id: string, userId: string): Promise<void> {
    const player = await playerRepository.findById(id);
    if (!player) {
      throw new AppError(404, 'Player profile not found');
    }

    await playerRepository.softDelete(id, userId);
  }
}

export const playerService = new PlayerService();
export default playerService;
