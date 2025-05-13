import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { validateSignup } from '../utils/validation';
import Coach from '../models/coach';

const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userData = req.body;
    const validationResult = validateSignup(userData);

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.errors
      });
    }

    const emailExists = await userService.emailExists(userData.email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists. Please use a different email.'
      });
    }

    const user = await userService.createUser(userData);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId in path' });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const { firstName, lastName, preferableActivity, target } = req.body;

    const updatedUser = await userService.updateUser({
      userId,
      firstName,
      lastName,
      ...(preferableActivity && { preferableActivity }),
      ...(target && { target })
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    const err = error as Error;
    const statusCode = err.message === 'User not found' ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.id) {
      return res.status(500).json({ message: 'User ID is missing' });
    }

    const isPasswordValid = await userService.verifyPassword({ id: user.id }, currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await userService.updatePassword(userId, newPassword);
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Failed to change password' });
  }
};

export default {
  register,
  getCurrentUser,
  updateUser,
  getProfile,
  changePassword
};
