const { UsersSubPage } = require('./UsersSubPage');

class UsersMainPage {
    constructor(page) {
        this.page = page;
        this.searchIcon = this.page.locator(`//div[@title='search']/i[contains(@class,'search-icon')]`);
        this.searchField = this.page.locator(`#add-user-srch`); 

    }

    getUserLocator(userName) {
        return this.page.locator(`
            //div[@class='DTFC_LeftBodyWrapper']
            //p[@class='singleImageText-p'][normalize-space()="${userName}"]
        `);
    }

    async searchUser(userName) {
        await this.searchIcon.click();
        await this.searchField.fill(userName);
        await this.page.keyboard.press('Enter');
    }

    async navigateToUsersSubPage(userName) {
        await this.searchUser(userName);
        const userLocator = this.getUserLocator(userName);
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup', { timeout: 30000 }),
            userLocator.first().click(),
        ]);
        return new UsersSubPage(newPage); 
    }
}

module.exports = { UsersMainPage };
