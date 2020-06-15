const puppeteer = require("puppeteer");

const self = {
    browser: null,
    pages: null,

    initialize: async (keyword) => {
        let queryString = keyword.replace(/\s/g, "+");
        let url = `https://www.cvmarket.lt/joboffers.php?_track=index_click_job_search&op=search&search_location=landingpage&ga_track=homepage&search%5Bkeyword%5D=php&mobile_search%5Bkeyword%5D=&tmp_city=&tmp_cat=&tmp_city=&tmp_category=&search%5Bkeyword%5D=${queryString}&search%5Bexpires_days%5D=&search%5Bjob_lang%5D=&search%5Bsalary%5D=&search%5Bjob_salary%5D=3`;
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
            browser.close();
        }
    },

    getResults: async (keyword) => {

        let elements = await self.page.$$('#f_jobs_main > table > tbody > tr');
        let results = [];
        for (let element of elements) {

            let jobTitle = await element.$eval(("a.f_job_title"), node => node.innerText.trim());
            let salaryAmount ="";
            let postDate="";

            try {
                salaryAmount = await element.$eval(('span.f_job_salary'), node => node.innerText.trim());
            } catch (ex) {
                salaryAmount = "Alga nenurodyta"
            }

            let jobUrl = await element.$eval(('a.f_job_title'), node => node.getAttribute("href"));
            let city = await element.$eval(('div.f_job_city'), node => node.innerText.trim());

            try {
                postDate = await element.$eval(("div.time-left-block"), node => node.innerText.trim());

            } catch (ex) {
                postDate = "Data nenurodyta"
            }

            let companyName = await element.$eval(("span.f_job_company"), node => node.innerText.trim());
            let webUrl = "https://www.cvmarket.lt";
            jobUrl = webUrl + jobUrl;

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