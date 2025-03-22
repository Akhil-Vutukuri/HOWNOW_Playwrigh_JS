class UsersSubPage {
    constructor(page){
        this.page = page;
        this.searchIcon = this.page.locator(`//div[@title='search']/i[contains(@class,'search-icon')]`);
        this.searchField = this.page.locator(`#content-srch`);
    }

    getContentLocator(contentName) {
        return this.page.locator(`
            //div[@class='DTFC_LeftBodyWrapper']
            //p[@class='singleImageText-p'][normalize-space()="${contentName}"]
        `);
    }

    async searchContent(contentName) {
        await this.searchIcon.click();
        await this.searchField.fill(contentName);
        await this.page.keyboard.press('Enter');
    }

    async searchAndCheckUserVisibility(contentName) {
        await this.searchContent(contentName);
        await this.getContentLocator(contentName).first().waitFor({ state: 'visible' });
        return this.getContentLocator(contentName).first().isVisible({ timeout: 5000 });
    }
}

module.exports = { UsersSubPage };