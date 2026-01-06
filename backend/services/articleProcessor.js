import 'dotenv/config';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';
import { rewriteArticle } from './llmService.js';
import { Blog } from '../models/Blogs.js';

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX;

if (!API_KEY || !CX) {
  throw new Error("Missing GOOGLE_API_KEY or GOOGLE_CX in env");
}

//new approach using google custom search api
const getCompetitorUrls = async (query) => {

  const url =
    `https://www.googleapis.com/customsearch/v1` +
    `?key=${API_KEY}` +
    `&cx=${CX}` +
    `&q=${encodeURIComponent(query)}` +
    `&num=2`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) return [];

  return data.items
    .map(item => item.link)
    .filter(Boolean);
};

export const processSingleArticle = async (articleId) => {
  const article = await Blog.findById(articleId);
  if (!article) throw new Error("Article not found");


  const competitorUrls = await getCompetitorUrls(article.title);
  console.log(`Found ${competitorUrls.length} URLs for: ${article.title}`);

  if (competitorUrls.length === 0) {
    console.warn("⚠️ No competitor URLs found. Skipping.");
    article.is_updated = false;
    await article.save();
    return null;
  }

  /* -------- 2. SCRAPE COMPETITOR ARTICLES -------- */

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const competitorTexts = [];

  try {
    for (const url of competitorUrls) {
      try {
        const page = await browser.newPage();

        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/119.0.0.0 Safari/537.36'
        );

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        const text = await page.evaluate(() =>
          document.body.innerText.slice(0, 4000)
        );

        competitorTexts.push(text);
        await page.close();
      } catch {
        console.warn(`⚠️ Failed to scrape competitor: ${url}`);
      }
    }
  } finally {
    await browser.close();
  }

  if (competitorTexts.length === 0) {
    console.warn("⚠️ No competitor content scraped. Skipping.");
    return null;
  }

 
  const rewritten = await rewriteArticle(
    article.content,
    competitorTexts[0] || '',
    competitorTexts[1] || ''
  );

  if (!rewritten) {
    console.warn(`⚠️ AI failed for: ${article.title}`);
    return null;
  }

  
  try {
    const aiData = JSON.parse(rewritten);

    aiData.references = competitorUrls;

    article.updated_content = JSON.stringify(aiData);
    article.is_updated = true;
    article.related_articles = competitorUrls;

    await article.save();

    console.log(`Article updated: ${article.title}`);
    return article;

  } catch (err) {
    console.error("JSON Parse Error:", err.message);
    return null;
  }
};