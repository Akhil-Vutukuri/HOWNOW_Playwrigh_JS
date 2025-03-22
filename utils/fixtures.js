const { test: baseTest, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage.js')

// Get the environment (default to 'staging')
const ENV = process.env.ENV && ['staging', 'production'].includes(process.env.ENV) ? process.env.ENV : 'staging';
const STORAGE_FOLDER = `storage/${ENV}`; // Separate session storage for each environment
const fixtures = baseTest.extend({

    // 🌟 Lazy Initialization for All Contexts (Only Opens When Used)
    contexts: async ({ browser }, use) => {
        const contextMap = {}; // Store contexts dynamically

        async function getContext(role) {
            if (!contextMap[role]) {
                const storageStatePath = `${STORAGE_FOLDER}/storage_${role}.json`;
                contextMap[role] = await browser.newContext({ storageState: storageStatePath });
            }
            return contextMap[role];
        }

        async function createLoggedInUserContext(username, password) {
            // Create a new browser context (fresh session)
            const userContext = await browser.newContext();
            const userPage = await userContext.newPage();

            // Use LoginPage class to log in
            const loginPage = new LoginPage(userPage);
            await loginPage.navigateToLogin();
            await loginPage.login(username, password);

            return userContext; // Return logged-in user context
        }

        await use({
            adminContext: () => getContext('admin'),
            managerContext: () => getContext('manager'),
            contributorContext: () => getContext('contributor'),
            readonlyContext: () => getContext('readonly'),
            newUserContext: (username, password) => createLoggedInUserContext(username, password) // NEW USER CONTEXT

        });

        // Cleanup: Close all contexts after test execution
        await Promise.all(
            Object.values(contextMap).map(context => context.close()));
    },
}, { scope: 'test' });

module.exports = { test: fixtures, expect };
