class CourseLandingPage{
    constructor(page){  
        this.page = page;
        this.startCourseBtn = this.page.locator(`//button[normalize-space()='Start Course']`);
        this.lessonCard = this.page.locator(`//a[@class='inner_item_card ']`); //This can be multiple, So use first().
        this.nextBtn = this.page.locator(`//a[normalize-space()='Next']`);
        this.exitBtn = this.page.locator(`//div[@class='user-pages-standalone']//a[normalize-space()='Exit']`);
        this.openDiscussionBtn = this.page.locator(`//div[@class='hn_btn--medium hn_btn--secondary open-discussion-bar']`);
    }

    async startCourse(){
        await this.startCourseBtn.click();
    }

    async openLesson(){
        await this.lessonCard.first().click();
    }

    async next(){
        await this.nextBtn.click();
    }   

    async exit(){
        await this.exitBtn.click();
    }

    async openDiscussion(){
        await this.openDiscussionBtn.click();
    }   

    async flagContent() {
        // Implement flag content functionality here
        console.log("Flag content functionality");
    }

    async completeCourse() {
        await this.openLesson();
        while (await this.nextBtn.isVisible()) {
            await this.next();
        }
        await this.exit();
    }

    async completeCoursePartially() {
        const lessonCount = await this.lessonCard.count();
        await this.openLesson();

        if (lessonCount === 2 || lessonCount === 3) {
            await this.exit();
        } else if (lessonCount >= 4) {
            for (let i = 1; i < lessonCount && i < 3; i++) {
                await this.next();
            }
            await this.exit();
        }
    }

}

module.exports = { CourseLandingPage } ;