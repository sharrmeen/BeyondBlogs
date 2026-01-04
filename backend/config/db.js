import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
  try {
    const db=process.env.MONGO_URI.replace("<PASSWORD>",process.env.DB_P)
    const conn = await mongoose.connect(db);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};