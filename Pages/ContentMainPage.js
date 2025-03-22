const { ContentSubPage } = require('./ContentSubPage');

class ContentMainPage  {
    constructor(page) {
        this.page = page;
        this.searchIcon = this.page.locator(`//div[@title='Search']/i[contains(@class,'search-icon')]`);
        this.searchField = this.page.locator(`#content-main-srch`); // Using CSS selector for better performance
    }

    static async visit(page) {
        await page.goto('/dashboard/content', { timeout: 90000 });
        return new ContentMainPage(page);
    }

    //For dynamic locators, we can use the below method
    getContentLocator(contentName) {
        return this.page.locator(`
            //div[@class='DTFC_LeftBodyWrapper']
            //p[@class='singleImageText-p'][normalize-space()="${contentName}"]
        `);
    }

    getViewMoreLocator(contentName) {
        return this.page.locator(`
            //div[@class='DTFC_LeftBodyWrapper']
            //p[@class='singleImageText-p'][normalize-space()="${contentName}"]
            //ancestor::td[contains(@class,'name_column')]
            //i[@title='View more']
        `);
    }

    async clickOnviewMore(contentName) {
        await this.getViewMoreLocator(contentName).click();
    }

    async searchContent(contentName) {
        await this.searchIcon.click();
        await this.searchField.fill(contentName);
        await this.page.keyboard.press('Enter');
    }

    async searchAndCheckContentVisibility(contentName) {
        await this.searchContent(contentName);
        await this.getContentLocator(contentName).first().wairFor({state: 'visible'});
        return await this.getContentLocator(contentName).first().isVisible();
    }

    async navigateToContentSubPage(contentName) {
        await this.searchContent(contentName);
        const contentLocator = this.getContentLocator(contentName);
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup', { timeout: 30000 }),
            contentLocator.first().click(),
        ]);
        return new ContentSubPage(newPage); 
    }
}

module.exports =  { ContentMainPage } ;
