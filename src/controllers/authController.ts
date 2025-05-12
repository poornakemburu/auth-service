import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { validateSignin } from '../utils/validation';
import { sendResponse, sendErrorResponse } from '../utils/response';

const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;
    const validationResult = validateSignin(body);

    if (!validationResult.isValid) {
      return sendErrorResponse(res, 400, 'Validation failed', validationResult.errors);
    }

    const { email, password } = body;
    const authResult = await authService.authenticateUser(email, password);

    if (!authResult.success) {
      return sendErrorResponse(res, 401, authResult.message || 'Authentication failed');
    }

    if (!authResult.user || !authResult.token) {
      return sendErrorResponse(res, 500, 'User data or token missing');
    }

    return sendResponse(res, 200, {
      message: 'Sign in successful',
      user: {
        id: authResult.user._id?.toString() || '',
        email: authResult.user.email || '',
        firstName: authResult.user.firstName || '',
        lastName: authResult.user.lastName || '',
        type: authResult.user.type || ''
      },
      token: authResult.token
    });
  } catch (error) {
    console.error('Signin error:', error);
    return sendErrorResponse(res, 500, 'Internal server error');
  }
};

export default { signin };
