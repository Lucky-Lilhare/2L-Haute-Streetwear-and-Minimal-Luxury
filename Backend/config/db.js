import mongoose from 'mongoose';

let dbConnectionError = null;
let dbConnectedHost = null;

/**
 * Get comprehensive database connection status & diagnostics
 */
export const getDbStatus = () => {
  const readyState = mongoose.connection.readyState;
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const hasUri = Boolean(process.env.MONGO_URI || process.env.MONGO_URL);

  let message = null;
  if (!hasUri) {
    message = 'MONGO_URI environment variable is not defined on this server. Please add MONGO_URI in your Render Dashboard (Environment tab).';
  } else if (dbConnectionError) {
    message = dbConnectionError.message;
  }

  return {
    status: dbStateMap[readyState] || 'unknown',
    connected: readyState === 1,
    host: mongoose.connection.host || dbConnectedHost || null,
    name: mongoose.connection.name || null,
    hasMongoUriEnv: hasUri,
    diagnostics: message,
  };
};

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    const errorMsg = 'No MONGO_URI or MONGO_URL found in environment variables. If running on Render, add MONGO_URI in Render Environment tab.';
    console.warn(`\n[Database Warning] ${errorMsg}\n`);
    dbConnectionError = new Error(errorMsg);
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    dbConnectionError = null;
    dbConnectedHost = conn.connection.host;
    console.log(`\n[Database] MongoDB Connected: ${conn.connection.host}\n`);
    return conn;
  } catch (error) {
    dbConnectionError = error;
    console.error(`\n[Database Error] Connection Failed: ${error.message}`);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('[Database Tip] If deploying to Render/Cloud, make sure MongoDB Atlas Network Access allows 0.0.0.0/0 (allow from anywhere).\n');
    }
    return null;
  }
};

export default connectDB;
