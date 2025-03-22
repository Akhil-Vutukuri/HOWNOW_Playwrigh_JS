class PageUtils {
    constructor(page) {
        this.page = page;
        this.dropDownOptions = this.page.locator("//div[@role='option']"); // Define dropdown locator here
    }

    /**
         * Scrolls to a specified element
         * @param {string | Locator} element - The selector string or locator
         */
    async scrollToElement(element) {
        const locator = typeof element === 'string' ? this.page.locator(element) : element;
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Gets the text content of an element
     * @param {string | locator} element - The selector string or locator
     * @returns {Promise<string>} The text content of the element
     */
    async getElementText(element) {
        const locator = typeof element === 'string' ? this.page.locator(element) : element;
        return await locator.textContent();
    }

    /**
     * Takes a screenshot and saves it to the screenshots directory
     * @param {string} filename - The name of the screenshot file
     */
    async takeScreenshot(filename) {
        await this.page.screenshot({ path: `screenshots/${filename}.png` });
    }

    /**
     * Selects multiple options from a dropdown
     * @param {string[]} optionsToSelect - List of option names to be selected
     */
    async selectDropDownOptions(optionsToSelect) {
        const options = await this.dropDownOptions.all(); // Get all available options

        for (const optionText of optionsToSelect) {
            for (const option of options) {
                const optionTextNormalized = (await option.textContent()).trim().toLowerCase();
                if (optionTextNormalized === optionText.toLowerCase()) {
                    await option.click();
                    break;
                }
            }
        }
    }
}

module.exports = { PageUtils };
