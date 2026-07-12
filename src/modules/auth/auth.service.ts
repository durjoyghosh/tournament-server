import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { userRepository } from '../user/user.repository';
import { userService } from '../user/user.service';
import { AppError } from '../../utils/AppError';
import { jwtConfig } from '../../config/jwt';
import { generateResetToken, hashToken } from '../../utils/crypto';
import { ILoginResponse } from './auth.types';
import { IUser } from '../user/user.interface';

export class AuthService {
  private generateTokenPair(user: IUser) {
    const payload = {
      id: user.id || user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessTokenExpiry as SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshTokenExpiry as SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }

  async register(userData: Partial<IUser>): Promise<ILoginResponse> {
    const newUser = await userService.createUser(userData);
    const tokens = this.generateTokenPair(newUser);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (user.status === 'inactive') {
      throw new AppError(403, 'Your account is deactivated');
    }

    const tokens = this.generateTokenPair(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret) as jwt.JwtPayload & {
        id: string;
      };

      const user = await userRepository.findById(decoded.id);
      if (!user || user.status === 'inactive') {
        throw new AppError(401, 'User no longer exists or is inactive');
      }

      // Generate a new token pair for rotation
      const tokens = this.generateTokenPair(user);
      return tokens;
    } catch (error) {
      throw new AppError(401, 'Invalid or expired refresh token. Please login again');
    }
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!user) {
      throw new AppError(404, 'There is no user with that email address.');
    }

    const { resetToken, hashedToken } = generateResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await user.save({ validateBeforeSave: false });

    // Returns raw resetToken so it can be used/tested.
    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashed = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
      isDeleted: false,
    });

    if (!user) {
      throw new AppError(400, 'Token is invalid or has expired');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  async changePassword(userId: string, oldPass: string, newPass: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user || user.isDeleted) {
      throw new AppError(404, 'User not found');
    }

    const isMatch = await user.comparePassword(oldPass);
    if (!isMatch) {
      throw new AppError(400, 'Current password is incorrect');
    }

    user.password = newPass;
    await user.save();
  }
}

export const authService = new AuthService();
export default authService;
