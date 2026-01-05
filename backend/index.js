import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// API Routes
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));