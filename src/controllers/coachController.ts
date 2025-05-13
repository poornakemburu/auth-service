// src/controllers/coachController.ts
import { Request, Response } from 'express';
import { coachService } from '../services/coachService';

export const coachController = {
  // Get coach profile
  async getProfile(req: Request, res: Response) {
    try {
      const coachId = req.params.id;
      const coach = await coachService.getCoachById(coachId);
      
      if (!coach) {
        return res.status(404).json({
          success: false,
          message: 'Coach not found'
        });
      }

      return res.status(200).json({
        success: true,
        coach
      });
    } catch (error) {
      console.error('Error getting coach profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get coach profile'
      });
    }
  },

  // Update coach profile
  async updateProfile(req: Request, res: Response) {
    try {
      const coachId = req.params.id;
      const updateData = req.body;

      const updatedCoach = await coachService.updateCoach(coachId, updateData);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        coach: updatedCoach
      });
    } catch (error: any) {
      console.error('Error updating coach profile:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }
};