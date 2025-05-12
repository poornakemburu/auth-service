import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';

const router = express.Router();

// POST /auth/sign-up
router.post('/sign-up', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.register(req, res);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// POST /auth/sign-in
router.post('/sign-in', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.signin(req, res);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

export default router;
