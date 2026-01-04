import puppeteer from "puppeteer";

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

        await browser.close();
        return finalTargets;

    } catch (error) {
        console.error("Scraping failed:", error.message);
        if (browser) await browser.close();
    }
};