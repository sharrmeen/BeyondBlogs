import 'dotenv/config'; 
import { connectDB } from '../config/db.js';
import { Blog } from '../models/Blogs.js';
import { processSingleArticle } from '../services/articleProcessor.js';
import mongoose from 'mongoose';

const runBulk = async () => {
    try {
        // connect to db
        await connectDB();

        // await Blog.updateMany({}, { is_updated: false, updated_content: "" });
        // console.log("Database reset: All articles are ready for processing again.");    

        const pending = await Blog.find({ is_updated: false });
        console.log(`Found ${pending.length} articles to process...`);

        for (const article of pending) {
            console.log(`Manually processing: ${article.title}`);
            await processSingleArticle(article._id);
        }

        console.log("All articles processed.");
        
        //disconnect
        await mongoose.disconnect();
    } catch (error) {
        console.error("Bulk processing failed:", error);
        process.exit(1);
    }
};

runBulk();