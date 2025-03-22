class CourseCreationPage {
    constructor(page) {
        this.page = page;
        this.courseNameField = this.page.locator('//input[@id="course_name"]');
        this.descriptionField = this.page.locator('//div[@class="tox-sidebar-wrap"]'); // Waiting for the loading spinner to disappear
        this.saveAndContinueBtn = this.page.locator('//p[text()="Save & Continue"]');
        this.addLessonBtn = this.page.getByLabel('Add Lesson');
        this.addTextBtn = this.page.locator('data-test-id=nugget-creation-add-content-text-button');
        this.addTextField = this.page.locator('data-test-id=nugget-creation-article-textarea');
        this.dummyBtn = this.page.locator("(//a[contains(@class,'position - relative common - add - item - style')])[1]");
        this.lessonSaveAndContinureBtn = this.page.locator('//p[text()="Save and Continue"]'); //click twice
        this.addPeopleField = this.page.locator('//input[@class="select2-input select2-default"]');
        this.addPeopleFieldToFill = this.page.locator('id=s2id_autogen1');
        this.userOptions = this.page.locator('//ul[@class="select2-results"]/li//div[@class="select2-result-label"]');
        this.applyBtn = this.page.locator('//span[text()="Apply"]');
        this.saveAndPublishBtn = this.page.locator('//p[text()="Save & Publish"]');
    }

    async addCourseTitle(title) {
        await this.courseNameField.fill(title);
        await this.descriptionField.waitFor({ state: 'visible' });
        //await this.page.waitForTimeout(6000);
    }

    async addLessonContent() {
        await this.addLessonBtn.click();
        await this.addTextBtn.click();
        await this.addTextField.waitFor({ state: 'visible' });
        await this.addTextField.fill('This is a test course');
        await this.page.waitForTimeout(1000);
        await this.lessonSaveAndContinureBtn.click();
        await this.page.waitForTimeout(1000);
        if (await this.lessonSaveAndContinureBtn.isVisible()) {
            await this.lessonSaveAndContinureBtn.click();
        }
    }

    async assignUsers(user) {
        await this.addPeopleFieldToFill.fill(user);
        await this.page.waitForTimeout(1000);
        await this.userOptions.filter({
            hasText: user
        }).first().click();
    }

    //const usersToAssign = ['Akhil Readonly', 'Another User', 'Test User']; you can also do this
    //async createCourse(title, usersToAssign)

    async createCourse(title, ...users) { // ... using the rest parameter syntax
        await this.addCourseTitle(title);
        await this.saveAndContinueBtn.click(); // For Step 1
        await this.addLessonContent();
        await this.saveAndContinueBtn.click(); // For Step 2
        await this.addPeopleField.click();
        for (const user of users) {  // Looping through the users array
            await this.assignUsers(user);
        }
        await this.applyBtn.click();
        await this.saveAndContinueBtn.click(); // For Step 3
        await this.saveAndPublishBtn.click(); // For Step 4
    }

    async createCourseWith2Lessons(title, ...users) { // ... using the rest parameter syntax
        await this.addCourseTitle(title);
        await this.saveAndContinueBtn.click(); // For Step 1
        await this.addLessonContent();
        await this.addLessonContent();
        await this.saveAndContinueBtn.click(); // For Step 2
        await this.addPeopleField.click();
        for (const user of users) {  // Looping through the users array
            await this.assignUsers(user);
        }
        await this.applyBtn.click();
        await this.saveAndContinueBtn.click(); // For Step 3
        await this.saveAndPublishBtn.click(); // For Step 4
    }
}
module.exports = { CourseCreationPage };