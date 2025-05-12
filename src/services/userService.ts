import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import { IUser } from '../models/user';

export const userService = {
  async emailExists(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return !!user;
  },

  async createUser(userData: Partial<IUser>): Promise<Partial<IUser>> {
    try {
      if ((userData as any).id) delete (userData as any).id;

      const user = new UserModel(userData);
      await user.save();

      const { password: _, ...userObject } = user.toObject();
      userObject.id = user._id.toString();

      return userObject;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  },

  async getUserFromToken(token: string): Promise<Partial<IUser> | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      const user = await UserModel.findById(decoded.userId);
      if (!user) return null;

      const { password: _, _id, ...userObj } = user.toObject();
      userObj.id = user._id.toString();

      return userObj;
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  },

  async getUserById(userId: string): Promise<Partial<IUser> | null> {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) return null;

    const userObject = user.toObject();
    userObject.id = user._id.toString();
    return userObject;
  },

  async updateUser(updateData: Partial<IUser> & { userId: string }): Promise<Partial<IUser>> {
    try {
      const { userId, ...profileData } = updateData;
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: profileData },
        { new: true }
      );

      if (!user) throw new Error('User not found');

      const { password: _, _id, ...updatedUser } = user.toObject();
      updatedUser.id = user._id.toString();

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async verifyPassword(user: { id: string }, password: string): Promise<boolean> {
    try {
      const userWithPassword = await UserModel.findById(user.id).select('+password');
      if (!userWithPassword) return false;

      return await bcrypt.compare(password, userWithPassword.password);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  },

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
};
