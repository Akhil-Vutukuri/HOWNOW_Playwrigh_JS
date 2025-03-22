const { test, expect } = require('../utils/fixtures');
const { PageObjectManager } = require('../utils/PageobjectManager');
const testData = require('../test-data/test-Data.json');
const { read } = require('fs');

test('Admin creates content and assigns it to readonly → Readonly completes it -> admin verifies analytics', async ({ contexts }) => {
    const adminContext = await contexts.adminContext();
    const adminPage = await adminContext.newPage();
    const pom = new PageObjectManager(adminPage);

    const adminHome = await pom.getHomePage(); // Navigates and returns HomePage instance
    const courseTitle = `Playwright with JS - ${Date.now()}`;
    const courseCreationPage = await adminHome.clickOnCreateCourse(); 
    await courseCreationPage.createCourse(courseTitle, testData.assignees.readonly);

    // ✅ Readonly User Actions
    const readonlyContext = await contexts.readonlyContext();
    const readonlyPage = await readonlyContext.newPage();
    const readonlyPOM = new PageObjectManager(readonlyPage);

    const readonlyLearningPage = await readonlyPOM.getLearningPage();
    const contentFound = await readonlyLearningPage.searchAndCheckContentVisibility(courseTitle);
    console.log(contentFound);
    expect(contentFound).toBeTruthy();

    const courseLandingPage = await readonlyLearningPage.NavigateToLandingPage(courseTitle);
    await courseLandingPage.completeCourse();

    // ✅ Admin Checks Analytics
    const contentMainPage = await pom.getContentMainPage();
    const contentSubPage = await contentMainPage.navigateToContentSubPage(courseTitle);
    const userFound = await contentSubPage.searchAndCheckUserVisibility(testData.assignees.readonly);
    expect(userFound).toBeTruthy();
    const userProgress = await contentSubPage.getUserProgress(testData.assignees.readonly);
    expect(userProgress).toBe(testData.contentProgress.comleted);
});

test('Admin creates content and assigns it to readonly → Readonly partially completes it -> admin verifies analytics', async ({ contexts }) => {
    const adminContext = await contexts.adminContext();
    const adminPage = await adminContext.newPage();
    const pom = new PageObjectManager(adminPage);

    const adminHome = await pom.getHomePage(); // Navigates and returns HomePage instance
    const courseCreationPage = await adminHome.clickOnCreateCourse();
    const courseTitle = `Playwright with JS - ${Date.now()}`;
    await courseCreationPage.createCourseWith2Lessons(courseTitle, testData.assignees.readonly);

    // ✅ Readonly User Actions
    const readonlyContext = await contexts.readonlyContext();
    const readonlyPage = await readonlyContext.newPage();
    const readonlyPOM = new PageObjectManager(readonlyPage);

    const readonlyLearningPage = await readonlyPOM.getLearningPage();
    readonlyLearningPage.switchToTab
    const contentFound = await readonlyLearningPage.searchAndCheckContentVisibility(courseTitle);
    console.log(contentFound);
    expect(contentFound).toBeTruthy();

    const courseLandingPage = await readonlyLearningPage.NavigateToLandingPage(courseTitle);
    await courseLandingPage.completeCoursePartially();

    // ✅ Admin Checks Analytics
    const contentMainPage = await pom.getContentMainPage();
    const contentSubPage = await contentMainPage.navigateToContentSubPage(courseTitle);
    const userFound = await contentSubPage.searchAndCheckUserVisibility(testData.assignees.readonly);
    expect(userFound).toBeTruthy();
    const userProgress = await contentSubPage.getUserProgress(testData.assignees.readonly);
    expect(userProgress).toBe(testData.contentProgress.inProgress);
});

test('Admin creates content and assigns it to readonly → Readonly ignores it -> admin verifies analytics on content main page and user subpage', async ({ contexts }) => {
    const adminContext = await contexts.adminContext();
    const adminPage = await adminContext.newPage();
    const pom = new PageObjectManager(adminPage);

    const adminHome = await pom.getHomePage();
    const courseCreationPage = await adminHome.clickOnCreateCourse();
    const courseTitle = `Playwright with JS - ${Date.now()}`;
    await courseCreationPage.createCourse(courseTitle, testData.assignees.readonly);

    // Verify analytics on Content Main Page
    const contentMainPage = await pom.getContentMainPage();
    const contentSubPage = await contentMainPage.navigateToContentSubPage(courseTitle);
    const userFound = await contentSubPage.searchAndCheckUserVisibility(testData.assignees.readonly);
    expect(userFound).toBeTruthy();
    const userProgress = await contentSubPage.getUserProgress(testData.assignees.readonly);
    expect(userProgress).toBe(testData.contentProgress.notStarted);

    // Verify analytics on User Sub Page
    const usersMainPage = await pom.getUsersMainPage();
    const usersSubPage = await usersMainPage.navigateToUsersSubPage(testData.assignees.readonly);
    const contentFound = await usersSubPage.searchAndCheckUserVisibility(courseTitle);
    expect(contentFound).toBeTruthy();

});

test('Admin navigates to History and applies the Source filer', async ({ contexts }) => {
    const adminContext = await contexts.adminContext();
    const adminPage = await adminContext.newPage();
    const pom = new PageObjectManager(adminPage);

    const adminLearningPage = await pom.getLearningPage();
    await adminLearningPage.switchToTab(testData.learningSections.history);
    await adminLearningPage.applySourceFilter("HowNow+");
    await adminLearningPage.applyTypeFilter("Course");
});
