const { CourseLandingPage } = require('./CourseLandingPage');
// const { LogLearningModal } = require('./LogLearningModal');
const { PageUtils } = require('../utils/PageUtils');

class LearningPage {
    constructor(page) {
        this.page = page;
        this.utils = new PageUtils(page); // Instantiates PageUtils with the same page
        this.searchIcon = this.page.getByTitle('Search');
        this.searchField = this.page.getByPlaceholder('Search');
        this.noDataFound = this.page.locator("//h4[contains(text(),'No relevant data found according to your selection')]");
        //section locators
        this.tabs = {
            all: this.page.getByLabel('All'),
            mustdo: this.page.getByLabel('Must Do'),
            announcements: this.page.getByLabel('Announcements'),
            upcoming: this.page.getByLabel('Upcoming'),
            history: this.page.getByLabel('History')
        }
        //filter locators
        this.filterBtn = this.page.locator("//button[@aria-label='Show Filters' and @aria-expanded='false']");
        this.collapseFilterBtn = this.page.locator("//button[@aria-label='Show Filters' and @aria-expanded='true']");
        this.sourceDropDownBtn = this.page.locator("//button[@aria-label='Source:']");
        this.typeDropDownBtn = this.page.locator("//button[@aria-label='Type:']");
        this.languageDropDownBtn = this.page.locator("//button[@aria-label='Language:']");
        this.durationDropDownBtn = this.page.locator("//button[@aria-label='Duration:']");
        this.applyBtn = this.page.locator("//button[normalize-space()='Apply']");
        // this.logLearningBtn = this.page.getByLabel('Log Learning');
    }

    getContentCardLocator(contentName) {
        return this.page.locator(`//p[contains(@class, 'ContentCard_cardTitle') and contains(text(), '${contentName}')]`);
    }

    /** @param {{string} tabName - Use values from `testData.learningSections.<tabName>` (e.g., `testData.learningSections.mustDo`) */
    async switchToTab(tabName) {
        const tab = this.tabs[tabName];
        await tab.click();
        return this;
    }

    async openFilters() {
        if (await this.filterBtn.isVisible()) {
            await this.filterBtn.click();
            await this.page.waitForTimeout(1500);  // Wait for filters to expand
        }
    }

    async applyTypeFilter(...optionsToSelect) {
        await this.openFilters();  // Ensure filters are open
        await this.typeDropDownBtn.click();  // Open Type dropdown
        await this.page.waitForSelector("//div[@role='listbox']"); // Wait for dropdown to be visible
        await this.utils.selectDropDownOptions(optionsToSelect); //Using PageUtils
        await this.applyBtn.click();  // Apply filters
        return this;
    }

    async applySourceFilter(...optionsToSelect) {
        await this.openFilters();  // Ensure filters are open
        await this.sourceDropDownBtn.click();  // Open Source dropdown
        await this.page.waitForSelector("//div[@role='listbox']"); // Wait for dropdown to be visible
        await this.utils.selectDropDownOptions(optionsToSelect); //Using PageUtils
        await this.applyBtn.click();  // Apply filters
        return this;
    }

    async searchContent(contentName) {
        await this.searchIcon.click();
        await this.searchField.fill(contentName);
        await this.page.keyboard.press('Enter');
    }

    async searchAndCheckContentVisibility(contentName) {
        await this.searchContent(contentName);
        await this.getContentCardLocator(contentName).first().waitFor({ state: 'visible' });
        return await this.getContentCardLocator(contentName).isVisible();
    }

    async NavigateToLandingPage(contentName) {
        // Locate and click the content card
        const contentCard = await this.page.waitForSelector(
            `//p[contains(@class, 'ContentCard') and contains(text(), '${contentName}')]`
        );

        // Find the content type from the card
        const contentTypeSelector = `//p[@title='${contentName}']/following-sibling::div[contains(@class, 'ContentCard_contentType')]/span[1]`;
        const contentType = await this.utils.getElementText(contentTypeSelector);

        await contentCard.click();
        await this.page.waitForLoadState('networkidle');

        // Return the correct page object
        switch (contentType.toLowerCase()) {
            case 'course':
                return new CourseLandingPage(this.page);
            // case 'nugget':
            //     return new NuggetLandingPage(this.page);
            // case 'scorm':
            //     return new ScormLandingPage(this.page);
            // case 'pathways':
            //     return new PathwaysLandingPage(this.page);
            // case 'live class':
            //     return new LiveClassLandingPage(this.page);
            default:
                throw new Error(`Unknown content type: ${contentType}`);
        }
    }

    // async clickLogLearningCTA() {
    //     await this.logLearningBtn.click();
    //     await this.page.waitForSelector('selector-for-modal-container');
    //     return new LogLearningModal(this.page);
    // }
}
module.exports = { LearningPage };