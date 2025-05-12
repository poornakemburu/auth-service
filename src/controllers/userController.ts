import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { validateSignup, validateUserUpdate } from '../utils/validation';
import { sendResponse, sendErrorResponse } from '../utils/response';

const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userData = req.body;
    const validationResult = validateSignup(userData);

    if (!validationResult.isValid) {
      return sendErrorResponse(res, 400, 'Validation failed', validationResult.errors);
    }

    const emailExists = await userService.emailExists(userData.email);
    if (emailExists) {
      return sendErrorResponse(res, 409, 'Email already exists. Please use a different email.');
    }

    const user = await userService.createUser(userData);
    return sendResponse(res, 201, {
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return sendErrorResponse(res, 500, 'Internal server error');
  }
};

const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return sendErrorResponse(res, 400, 'Missing userId in path');
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    return sendResponse(res, 200, { user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return sendErrorResponse(res, 500, 'Internal server error');
  }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userData = req.body;

    if (!userData.userId) {
      return sendErrorResponse(res, 400, 'User ID is required');
    }

    const validationResult = validateUserUpdate(userData);
    if (!validationResult.isValid) {
      return sendErrorResponse(res, 400, 'Validation failed', validationResult.errors);
    }

    const updatedUser = await userService.updateUser({
      userId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      ...(userData.preferableActivity && { preferableActivity: userData.preferableActivity }),
      ...(userData.target && { target: userData.target })
    });

    return sendResponse(res, 200, {
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    const err = error as Error;
    const statusCode = err.message === 'User not found' ? 404 : 500;
    return sendErrorResponse(res, statusCode, err.message || 'Failed to update profile');
  }
};

const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return sendErrorResponse(res, 400, 'User ID is required');
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    return sendResponse(res, 200, { user });
  } catch (error) {
    console.error('Error getting profile:', error);
    return sendErrorResponse(res, 500, 'Failed to get profile');
  }
};

const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return sendErrorResponse(res, 400, 'All fields are required');
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    if (!user.id) {
      return sendErrorResponse(res, 500, 'User ID is missing');
    }

    const isPasswordValid = await userService.verifyPassword({ id: user.id }, currentPassword);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Current password is incorrect');
    }

    await userService.updatePassword(userId, newPassword);
    return sendResponse(res, 200, { message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return sendErrorResponse(res, 500, 'Failed to change password');
  }
};

export default {
  register,
  getCurrentUser,
  updateUser,
  getProfile,
  changePassword
};
