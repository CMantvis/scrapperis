const puppeteer = require("puppeteer");

const self = {
    browser: null,
    pages: null,

    initialize: async (keyword) => {
        const queryString = keyword.replace(/\s/g, "%20");
        const url = `https://www.cvonline.lt/darbo-skelbimai/q-${queryString}`;
        self.browser = await puppeteer.launch();
        self.page = await self.browser.newPage();
        // go to the searched page
        await self.page.goto(url, { waitUntil: "networkidle0" });
    },

    getResults: async (keyword, website) => {

        let elements = await self.page.$$('div[class*="cvo_module_offer_content"]');
        let results = [];

        for (let element of elements) {
            let jobTitle = await element.$eval(('div.offer_primary_info > h2'), node => node.innerText.trim());
            let salaryAmount = "";
            let postDate = "";

            try {
                salaryAmount = await element.$eval(('span.salary-blue'), node => node.innerText.trim());
            } catch (ex) {
                salaryAmount = "Alga nenurodyta"
            }

            let jobUrl = await element.$eval(('div.offer_primary_info > h2 > a'), node => node.getAttribute("href"));
            let city = await element.$eval(('li.offer-location'), node => node.innerText.trim());

            try {
                postDate = await element.$eval(('div.cvo_module_offer_content > div.cvo_module_offer_box.offer_content > div > div > div > ul.cvo_module_offer_meta.offer_dates > li:nth-child(1) > span:nth-child(2)'), node => node.innerText.trim());
            } catch (ex) {
                postDate = "Data nenurodyta"
            }

            let companyName = await element.$eval(('li.offer-company'), node => node.innerText.trim());
            let webUrl = "https://www.cvonline.lt";

            results.push({
                jobTitle,
                salaryAmount,
                jobUrl,
                city,
                postDate,
                companyName,
                keyword,
                searchedSite: webUrl,
                liked: false,
                dateScrapped: new Date()
            });
        }
        return results;
    }
}

module.exports = self;