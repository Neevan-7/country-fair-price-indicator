import { AppDataSource } from '@config/database';
import { User } from '@models/User';
import { AppError } from '@utils/AppError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'TOURIST' | 'LOCAL' | 'MERCHANT';
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = this.userRepository.create({
      ...data,
      passwordHash,
      trustScore: 100,
    });

    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };

    const jwtSecret = (process.env.JWT_SECRET || 'secret') as any;
    const jwtRefreshSecret = (process.env.JWT_REFRESH_SECRET || 'refresh') as any;
    const jwtExpiration = (process.env.JWT_EXPIRATION || '7d') as any;

    const accessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiration,
    });

    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      }
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh') as any;
      const user = await this.userRepository.findOne({ where: { id: decoded.id } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}
