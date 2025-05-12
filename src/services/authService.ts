import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import { IUser } from '../models/user';

interface AuthResult {
  success: boolean;
  message?: string;
  code?: string;
  user?: Partial<IUser>;
  token?: string;
}

export const authService = {
  async authenticateUser(email: string, password: string): Promise<AuthResult> {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });

      if (!user) {
        return {
          success: false,
          message: 'Email ID not found',
          code: 'EMAIL_NOT_FOUND'
        };
      }

      const isPasswordValid = await user.isValidPassword(password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'We couldn\'t log you in. Double-check your password and try again.',
          code: 'INVALID_PASSWORD'
        };
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      const { password: _, ...userObj } = user.toObject();

      return {
        success: true,
        user: userObj,
        token
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
};
