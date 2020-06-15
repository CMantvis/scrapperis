const puppeteer = require("puppeteer");

const self = {
    browser: null,
    pages: null,

    initialize: async (keyword) => {
        const queryString = keyword.replace(/\s/g, "+");
        const url = `https://www.cvbankas.lt/?miestas=&padalinys%5B%5D=&keyw=${queryString}`;
        self.browser = await puppeteer.launch({
            args: [
              '--no-sandbox'
            ],
          });
        self.page = await self.browser.newPage();
        // go to the searched page
        try {
            await self.page.goto(url, {waitUntil: 'load', timeout: 0});
        } catch (error) {
            console.log(error);
            self.browser.close();
        }
    },

    getResults: async (keyword) => {

        let elements = await self.page.$$("#js_id_id_job_ad_list > article[class*='list_article']");
        let results = [];

        for (let element of elements) {

            let jobTitle = await element.$eval(('h3.list_h3'), node => node.innerText.trim());
            let salaryAmount ="";
            let postDate="";

            try {
                salaryAmount = await element.$eval(('span[class="salary_text"] > span[class*="salary_amount"]'), node => node.innerText.trim());
            } catch (ex) {
                salaryAmount = "Alga nenurodyta"
            }

            let jobUrl = await element.$eval(('a.list_a'), node => node.getAttribute("href"));
            let city = await element.$eval(('span.list_city'), node => node.innerText.trim());

            try {
                postDate = await element.$eval(('span.txt_list_2'), node => node.innerText.trim());

            } catch (ex) {
                postDate = "Data nenurodyta"
            }

            let companyName = await element.$eval(('span.dib.mt5'), node => node.innerText.trim());
            let webUrl = "https://www.cvbankas.lt";

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
        self.browser.close();
        return results;
    }
}

module.exports = self;