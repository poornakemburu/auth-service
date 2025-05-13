// src/routes/coachRoutes.ts
import express from 'express';
import { coachController } from '../controllers/coachController';

const router = express.Router();

// GET /:id
router.get('/:id', async (req, res, next) => {
  try {
    await coachController.getProfile(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT /:id
router.put('/:id', async (req, res, next) => {
  try {
    await coachController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});


export default router;