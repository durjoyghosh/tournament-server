import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Super Admin' | 'Organizer' | 'Team Manager' | 'Coach' | 'Player' | 'Referee' | 'Scorekeeper' | 'Spectator';
  organizerStatus: 'none' | 'pending' | 'approved' | 'rejected';
  phoneNumber?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  suspendReason?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  isEmailVerified: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
