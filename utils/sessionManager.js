const { chromium } = require('@playwright/test');
const fs = require('fs');
const { LoginPage } = require('../Pages/LoginPage');

// Get the environment (default to 'staging')
let ENV = process.env.ENV && process.env.ENV !== 'production'
    ? process.env.ENV
    : 'staging';

const BASE_URL = ENV === 'production' ? 'https://qateam.hownow.app' : 'https://team.hownowindia.com';
const STORAGE_FOLDER = `storage/${ENV}`; // Different folder for each environment

// Ensure the storage folder exists
if (!fs.existsSync(STORAGE_FOLDER)) {
    fs.mkdirSync(STORAGE_FOLDER, { recursive: true });
}

// Define users & their storage paths dynamically
const CREDENTIALS = {
    staging: {
        admin: { email: 'akhil.vutukuri@gethownow.com', password: 'Hownow123' },
        manager: { email: 'akhil.vutukuri+manager2@gethownow.com', password: 'Hownow123' },
        contributor: { email: 'akhil.vutukuri+contributor@gethownow.com', password: 'Hownow123' },
        readonly: { email: 'akhil.vutukuri+readonly2@gethownow.com', password: 'Hownow123' }
    },
    production: {
        admin: { email: 'akhil.vutukuri@gethownow.com', password: 'Hownow123' },
        manager: { email: 'akhil.vutukuri+manager@gethownow.com', password: 'Hownow123' },
        contributor: { email: 'akhil.vutukuri+contributor@gethownow.com', password: 'Hownow123' },
        readonly: { email: 'akhil.vutukuri+readonly@gethownow.com', password: 'Hownow12345' }
    }
};

// ✅ Dynamically set users based on environment
const USERS = [
    { role: 'Admin', ...CREDENTIALS[ENV].admin, storagePath: `${STORAGE_FOLDER}/storage_admin.json` },
    { role: 'Manager', ...CREDENTIALS[ENV].manager, storagePath: `${STORAGE_FOLDER}/storage_manager.json` },
    { role: 'Contributor', ...CREDENTIALS[ENV].contributor, storagePath: `${STORAGE_FOLDER}/storage_contributor.json` },
    { role: 'Readonly', ...CREDENTIALS[ENV].readonly, storagePath: `${STORAGE_FOLDER}/storage_readonly.json` }
];

// ✅ Check if session is valid
async function isSessionValid(storagePath) {
    try {
        if (fs.existsSync(storagePath)) {
            const storageState = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
            const hnSessionCookie = storageState.cookies.find(c => c.name === 'hn_session_id');

            if (hnSessionCookie) {
                console.log(`✅ ${storagePath} hn_session_id cookie found. Session assumed valid.`);
                return true;
            } else {
                console.log(`⚠️ ${storagePath} hn_session_id cookie not found.`);
                return false;
            }
        }
        console.log(`⚠️ No session file found for ${storagePath}`);
        return false;
    } catch (error) {
        console.error(`❌ Error checking session for ${storagePath}: ${error.message}`);
        return false;
    }
}

// ✅ Setup Sessions Dynamically Based on Environment
async function setupSessions() {
    console.log(`🚀 Starting session setup for ${ENV.toUpperCase()} environment...`);

    const browser = await chromium.launch({ headless: false });

    for (const user of USERS) {
        try {
            if (await isSessionValid(user.storagePath)) {
                console.log(`✅ ${user.role} session is still valid. Skipping login.`);
                continue;
            }

            console.log(`🔴 ${user.role} session expired or missing. Logging in...`);
            const context = await browser.newContext();
            const page = await context.newPage();
            const loginPage = new LoginPage(page, BASE_URL);
            await loginPage.navigateToLogin();
            await loginPage.login(user.email, user.password);
            await page.waitForURL(`${BASE_URL}/rfe/home`, { timeout: 90000 });

            await context.storageState({ path: user.storagePath });
            console.log(`✅ New session stored for ${user.role} at ${user.storagePath}`);

            await context.close();
        } catch (error) {
            console.error(`❌ Error setting up session for ${user.role}: ${error.message}`);
        }
    }

    await browser.close();
    console.log(`✅ All sessions setup complete for ${ENV.toUpperCase()}!`);
}

// ✅ Run automatically if executed directly
if (require.main === module) {
    setupSessions();
}

// ✅ Export function for use in test files
module.exports = setupSessions;
