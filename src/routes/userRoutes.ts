import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import userController from '../controllers/userController';
import { userService } from '../services/userService';

const router = express.Router();

// GET /api/users/check-email
router.get('/check-email', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email parameter is required' });
    }
    const exists = await userService.emailExists(email);
    res.status(200).json({ success: true, data: { exists } });
  } catch (err) {
    next(err);

  }
}) as RequestHandler);

// GET /users/current
router.get('/current', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.getCurrentUser(req, res);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// PUT /edit-profile
router.put('/:id', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.updateUser(req, res);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// PUT /users/:id/password
router.put('/:id/password', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.changePassword(req, res);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// GET /user/:id
router.get('/:id', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.getProfile(req, res);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

export default router;
