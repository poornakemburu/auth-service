// src/services/coachService.ts
import Coach from '../models/coach';
import { ICoach } from '../models/coach';

export const coachService = {
  // Get coach by ID
  async getCoachById(coachId: string) {
    try {
      const coach = await Coach.findById(coachId).select('-password');
      if (!coach) return null;
      return coach;
    } catch (error) {
      console.error('Error getting coach:', error);
      throw error;
    }
  },

  // Update coach
  async updateCoach(coachId: string, updateData: Partial<ICoach>) {
    try {
      const coach = await Coach.findByIdAndUpdate(
        coachId,
        { $set: updateData },
        { new: true }
      ).select('-password');
      
      if (!coach) throw new Error('Coach not found');
      return coach;
    } catch (error) {
      console.error('Error updating coach:', error);
      throw error;
    }
  }
};