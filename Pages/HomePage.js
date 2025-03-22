const { CourseCreationPage } = require('./CourseCreationPage'); // Import the class

class HomePage{
    constructor(page){
        this.page = page;
        this.createBtn = this.page.getByLabel('create content menu');
        this.createCourseBtn = this.page.locator('//span[text()="Create Course"]');
        this.createNuggetBtn = this.page.locator('//span[text()="Create Nugget"]');
        this.learningBtn = this.page.getByLabel('Learning');
    }
    
    async clickOnCreateCourse(){
        await this.createBtn.click();
        await this.page.waitForTimeout(3000);
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup',{ timeout: 30000 }), // Wait for new tab to open
            this.createCourseBtn.click(),
        ]);
        return new CourseCreationPage(newPage); // Return the new tab's Page Object
    }
}

module.exports = { HomePage }; // Export the class
