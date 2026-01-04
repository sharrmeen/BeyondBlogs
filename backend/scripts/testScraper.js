import { scrapedOldestArticles } from "./scrapeOldest.js";

const test_url="https://beyondchats.com/blogs/page/15/"


async function runTest(){
    console.log("starting scraper test")

    try {
        const links=await scrapedOldestArticles(test_url)

        if(links && links.length>0){
            console.log("Links scraped successfully");
        }
    } catch (error) {
        console("Error fetching links")
    }
}


runTest()