import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/2l_clothing';
    const conn = await mongoose.connect(mongoUri);

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    // If running in development without a live MongoDB instance, warn instead of killing process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
