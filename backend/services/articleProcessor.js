import puppeteer from 'puppeteer';
import { rewriteArticle } from './llmService.js';
import { Blog } from '../models/Blogs.js';

export const processSingleArticle = async (articleId) => {
    const article = await Blog.findById(articleId);
    if (!article) throw new Error("Article not found");

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    try {
        //google search and link extraction
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(article.title)}`);
        const competitorUrls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div.g a'))
                .map(a => a.href)
                .filter(href => href.startsWith('http') && !href.includes('google.com'))
                .slice(0, 2);
        });

        //collect top articles
        let competitorTexts = [];
        for (const url of competitorUrls) {
            const compPage = await browser.newPage();
            await compPage.goto(url, { waitUntil: 'domcontentloaded' });
            competitorTexts.push(await compPage.evaluate(() => document.body.innerText.slice(0, 4000)));
            await compPage.close();
        }
        //process and update article
        const rewritten = await rewriteArticle(article.content, competitorTexts[0], competitorTexts[1]);
        
        //update in db
       if(rewritten)
        { 
            article.updated_content = `${rewritten}\n\n### References\n${competitorUrls.join('\n')}`;
            article.is_updated = true;
            article.related_articles = competitorUrls;
            await article.save();
            return article;
        }
        else{
            console.log(` Skipped: Gemini failed to generate valid content for ${article.title}`);
        }

       
    } finally {
        await browser.close();
    }
};