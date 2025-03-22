const { HomePage } = require('../Pages/HomePage');
// const { CourseCreationPage } = require('../Pages/CourseCreationPage');
const { LearningPage } = require('../Pages/LearningPage');
const { ContentMainPage } = require('../Pages/ContentMainPage');
const { UsersMainPage } = require('../Pages/UsersMainPage');
// const { ContentSubPage } = require('../Pages/ContentSubPage');

class PageObjectManager {
    constructor(page) {
        this.page = page;
        this.homePage = null;
        this.courseCreationPage = null;
        this.learningPage = null;
        this.contentMainPage = null;
        this.contentSubPage = null;
    }

    /**
     * Navigates to Home Page and returns an instance of HomePage.
     * @returns {Promise<HomePage>}
     */
    async getHomePage() {
        if (!this.homePage) {
            await this.page.goto('/rfe/home', { timeout: 90000 }); // ✅ Auto-Navigate
            this.homePage = new HomePage(this.page);
        }
        return this.homePage;
    }

    // /**
    //  * Navigates to Course Creation Page after HomePage interaction.
    //  * @returns {Promise<CourseCreationPage>}
    //  */
    // async getCourseCreationPage() {
    //     if (!this.courseCreationPage) {
    //         this.courseCreationPage = new CourseCreationPage(this.page);
    //     }
    //     return this.courseCreationPage;
    // }

    /**
     * Navigates to Learning Page and returns an instance of LearningPage.
     * @returns {Promise<LearningPage>}
     */
    async getLearningPage() {
        if (!this.learningPage) {
            await this.page.goto('/rfe/home/my-learning/assigned', { timeout: 90000 }); // ✅ Auto-Navigate
            await this.page.locator("//h1[contains(text(),'Learning')]").waitFor({ timeout: 90000 });
            this.learningPage = new LearningPage(this.page);
        }
        return this.learningPage;
    }

    /**
     * Navigates to Content Main Page and returns an instance of ContentMainPage.
     * @returns {Promise<ContentMainPage>}
     */
    async getContentMainPage() {
        if (!this.contentMainPage) {
            await this.page.goto('/dashboard/content', { timeout: 90000 }); // ✅ Auto-Navigate
            this.contentMainPage = new ContentMainPage(this.page);
        }
        return this.contentMainPage;
    }

    /**
     * Navigates to Users Main Page and returns an instance of UsersMainPage.
     * @returns {Promise<UsersMainPage>}
     */
    async getUsersMainPage() {
        if (!this.usersMainPage) {
            await this.page.goto('/dashboard/users', { timeout: 90000 }); // ✅ Auto-Navigate
            this.usersMainPage = new UsersMainPage(this.page);
        }
        return this.usersMainPage;
    }

    // /**
    //  * Navigates to Content Sub Page.
    //  * @param {string} courseTitle - The title of the course.
    //  * @returns {Promise<ContentSubPage>}
    //  */
    // async getContentSubPage(courseTitle) {
    //     if (!this.contentSubPage) {
    //         this.contentSubPage = new ContentSubPage(this.page, courseTitle);
    //     }
    //     return this.contentSubPage;
    // }
}
module.exports = { PageObjectManager };
