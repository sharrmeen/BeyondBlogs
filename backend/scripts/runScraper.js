import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { scrapedOldestArticles } from './testScraper.js';
import mongoose from 'mongoose';

const run = async () => {
    try {
        await connectDB();
        const target = "https://beyondchats.com/blogs/page/15/";
        console.log("Starting manual scrape...");
        await scrapedOldestArticles(target);
        console.log("Scrape finished.");
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Scraper runner failed:", error);
    }
};

run();