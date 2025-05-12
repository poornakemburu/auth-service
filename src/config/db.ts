import mongoose from 'mongoose';

let isConnected: boolean = false;

/**
 * Connects to MongoDB database
 */
export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    //const mongoUri = process.env.MONGO_URI;
    
    const mongoUri = "mongodb+srv://Bhoomika:Hope630@aws-test.tgbpmou.mongodb.net/EnergyX"

    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('MongoDB connected');
    
    // Drop the unique index on the id field to avoid duplicate key errors
    try {
      // Get the users collection
      const db = mongoose.connection.db;
      if (!db) {
        console.warn('Database connection not available yet');
        return;
      }
      
      const usersCollection = db.collection('users');
      
      // Check if the index exists before trying to drop it
      const indexes = await usersCollection.indexes();
      const idIndex = indexes.find(index => index.name === 'id_1');
      
      if (idIndex) {
        console.log('Dropping unique index on id field...');
        await usersCollection.dropIndex('id_1');
        console.log('Successfully dropped index on id field');
      }
    } catch (indexError) {
      console.warn('Failed to drop index, might not exist or insufficient permissions:', indexError);
      // Continue execution as this is not critical
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}