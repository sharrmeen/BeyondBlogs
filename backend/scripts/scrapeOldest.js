import puppeteer from "puppeteer";
import { Blog } from "../models/Blogs.js";

export const scrapedOldestArticles = async (lastPageUrl) => {
    
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    let collectedLinks = [];
    let target = 5;
    let currentUrl = lastPageUrl;

    try {
        console.log(`Starting at the end: ${currentUrl}`);

        while (collectedLinks.length < target) {

            await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

            const pageLinks = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('.entry-title a'));
                return anchors.map(a => a.href).reverse(); // Reverse to get oldest first
            });

            collectedLinks = [...collectedLinks, ...pageLinks];
            console.log(`Collected ${collectedLinks.length} links so far...`);

            //find url of prev page if more needed
            if (collectedLinks.length < target) {
                const prevPageUrl = await page.evaluate(() => {
                    const prevBtn = document.querySelector('a.prev');
                    return prevBtn ? prevBtn.href : null;
                });

                if (prevPageUrl) {
                    console.log(`Moving back to: ${prevPageUrl}`);
                    currentUrl = prevPageUrl;
                } else {
                    console.log("No more previous pages available.");
                    break; 
                }
            }
        }

        const finalTargets = collectedLinks.slice(0, target);
        console.log("Final 5 Oldest URLs:", finalTargets);

        // function to navigate to each url and collect the data according to the model

        for (const url of finalTargets) {

            const exists = await Blog.exists({ url });
            if (exists) {
                console.log(`- Skipping: Already processed ${url}`);
                continue;
            }

            const articlePage = await browser.newPage();
            
            await articlePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            try {
                await articlePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

                const articleData = await articlePage.evaluate((link) => ({
                    title: document.querySelector('h1.elementor-heading-title')?.innerText.trim() || "Untitled",
                    content: document.querySelector('.elementor-widget-theme-post-content')?.innerText.trim() || "",
                    url: link,
                    is_updated: false
                }), url);

               
                if (!articleData.content) {
                    console.warn(`! Warning: No content found for ${url}`);
                    continue; 
                }

                await Blog.create(articleData);
                console.log(`Saved to db: ${articleData.title}`);

            } catch (err) {
                console.error(`ailed to scrape ${url}:`, err.message);
            } finally {
                await articlePage.close();
            }
        }

        await browser.close();
        // return finalTargets;

    } catch (error) {
        console.error("Scraping failed:", error.message);
        if (browser) await browser.close();
    }
};