class ContentSubPage {
    constructor(page) {
        this.page = page;
        this.searchIcon = this.page.locator(`//div[@title='search']/i[contains(@class,'search-icon')]`);
        this.searchField = this.page.locator(`id=content-sub-main-srch`);
    }

    getUserProgressLocator(userName){
        return this.page.locator(`
            //div[@class='dataTables_scrollBody']
            //p[@class='singleImageText-p'][normalize-space()="${userName}"]
            //ancestor::td//following-sibling::td
            //div[@class='progress_label']
        `);
    }

    async getUserProgress(userName){
        return await this.getUserProgressLocator(userName).textContent();
    }

    getUserNameLocator(userName){
        return this.page.locator(`
            //div[@class='dataTables_scrollBody']
            //p[@class='singleImageText-p'][normalize-space()="${userName}"]
        `);
    }

    async searchUser(userName) {
        await this.searchIcon.click();
        await this.searchField.fill(userName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    async searchAndCheckUserVisibility(userName) {
        await this.searchUser(userName);
        await this.getUserNameLocator(userName).first().waitFor({ state: 'visible' });
        return this.getUserNameLocator(userName).first().isVisible();
    }

}

module.exports = { ContentSubPage };