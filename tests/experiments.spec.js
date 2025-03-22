const { test, expect } = require('../utils/fixtures');
const { HomePage } = require('../Pages/HomePage');  
const { CourseCreationPage } = require('../Pages/CourseCreationPage');

test('Admin creates content and assigns it to readonly', async ({ contexts }) => {
    const adminContext = await contexts.adminContext();
    const adminPage = await adminContext.newPage();
    const adminHome = await HomePage.visit(adminPage);
    const courseCreationPage = await adminHome.clickOnCreateCourse();
});