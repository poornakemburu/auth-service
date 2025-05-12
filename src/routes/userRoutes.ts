import express from 'express';
import userController from '../controllers/userController';
import { userService } from '../services/userService';

const router = express.Router();

// GET /api/users/check-email
router.get('/check-email', async (req, res, next) => {
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
});

// GET /users/current
router.get('/current', async (req, res, next) => {
  try {
    await userController.getCurrentUser(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT /edit-profile
router.put('/edit-profile', async (req, res, next) => {
  try {
    await userController.updateUser(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id/password
router.put('/:id/password', async (req, res, next) => {
  try {
    await userController.changePassword(req, res);
  } catch (error) {
    next(error);
  }
});

// GET /user/:id
router.get('/:id', async (req, res, next) => {
  try {
    await userController.getProfile(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
