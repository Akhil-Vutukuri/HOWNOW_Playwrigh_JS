import { test } from '@playwright/test';
import { error } from 'console';
import fs from 'fs'; // File system module for reading and writing files
import path from 'path'; // For handling file paths
const Tesseract = require('tesseract.js');


// Utility function to read JSON file synchronously
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`); // Logging the error
        return [];
    }
};

// Load JSON data containing partners and their content
const jsonData = readJsonFile('./test-data/data.json'); // This file should be in the same directory as this script

const baseDir = './HNP_Output'; //base directory for Logs
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
}

let screenshotPath;
// let baseDir2 = "C:\\Users\\hozefa.kherodawala\\Documents\\PLaywright_JS\\";

// Custom function to write logs into a partner-sepcific file instead of printing them on the console
async function writeLog(partnerName, message) {
    const safePartnerName = partnerName.replace(/[/\\?%*:|"<>]/g, '-'); // Sanitize the partner name
    const logFilePath = path.join(baseDir, `${safePartnerName}_HowNowTestOutput.txt`); // Create a log file path
    await fs.promises.appendFile(logFilePath, `${message}\n`); // Append the message to the log file asynchronously
}

// Custom function to save a screenshot in a partner-specific folder
async function saveScreenshot(page, partnerName, content, index = 1) {
    const safePartnerName = partnerName.replace(/[/\\?%*:|"<>]/g, '-');
    const safeContentName = content.replace(/[/\\?%*:|"<>]/g, '-');
    const partnerFolder = path.join(baseDir, safePartnerName);

    await fs.promises.mkdir(partnerFolder, { recursive: true });

    let screenshotFileName = `${safeContentName}.png`;
    screenshotPath = path.join(partnerFolder, screenshotFileName);

    // If file exists, append an index (_1, _2, etc.)
    let counter = index;
    while (fs.existsSync(screenshotPath)) {
        screenshotFileName = `${safeContentName}_${counter}.png`;
        screenshotPath = path.join(partnerFolder, screenshotFileName);
        counter++;
    }
    await page.screenshot({ path: screenshotPath, fullPage: true });
}

async function saveMismatchedScreenshot(page, partnerName, content, index = 1) {
    const safePartnerName = partnerName.replace(/[/\\?%*:|"<>]/g, '-');
    const safeContentName = content.replace(/[/\\?%*:|"<>]/g, '-');
    const partnerMismatchedShots = path.join(baseDir, safePartnerName + "_mismatched");

    await fs.promises.mkdir(partnerMismatchedShots, { recursive: true });

    let screenshotFileName = `${safeContentName}.png`;
    screenshotPath = path.join(partnerMismatchedShots, screenshotFileName);

    let counter = index;
    while (fs.existsSync(screenshotPath)) {
        screenshotFileName = `${safeContentName}_${counter}.png`;
        screenshotPath = path.join(partnerMismatchedShots, screenshotFileName);
        counter++;
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });
}

// Create a test suite to verify the Hn+ Partner Contents
// This creates a separate test for each partner-content combination.
// The tests run in parallel for all partners and their respective contents.
test.describe.parallel('Verifying the Hn+ Partner Content', () => {
    jsonData.forEach((partner) => {
        partner.contentName.forEach((content) => {
            test(`Partner: "${partner.partnerName}" - Content: "${content}"`, async ({ browser }) => {
                const context = await browser.newContext();
                const page = await context.newPage();

                // Login Steps
                await page.goto('https://team.hownowindia.com');
                await page.locator('#user_email').fill('akhil.vutukuri@gethownow.com');
                await page.locator('#user_password').fill('Hownow123');
                await page.locator("[type='submit']").click();

                const sanitizeContent = content.trim()
                // Navigation & Search Setup
                await page.goto(`https://team.hownowindia.com/dashboard/insights/hnp_partners/all/hnp_partner_courses?content_provider=${partner.partnerId}&search_key=${sanitizeContent}`);

                // Check if the content is found; if not, log and exit the test
                const contentCSS = page.locator("td.name_column.cursor-pointer.sorting_1[data-dt-column='1'] p:first-of-type")
                await contentCSS.last().waitFor({ state: 'visible' });
                const contentCount = await contentCSS.count();
                if (contentCount == 0) {
                    writeLog(partner.partnerName, `❌ Content not found: ${content}`);
                    await context.close();
                    return;
                }
                for (let i = 0; i < contentCount; i++) {
                    await contentCSS.nth(i).waitFor({ state: 'visible' });
                    const contentTitle = await contentCSS.nth(i).getAttribute("title");

                    if (contentTitle === content) {
                        await contentCSS.nth(i).click();
                        await page.waitForLoadState(); // Ensure the page is fully loaded before proceeding

                        // Wait for the preview button to appear and click on it
                        await page.locator(`id=hnp-course-preview`).waitFor({ state: 'visible' })
                        await page.locator(`id=hnp-course-preview`).click();

                        // Handle popups
                        const newPage1 = await context.waitForEvent('page', { timeout: 30000 });
                        await newPage1.waitForLoadState();

                        const newPage2 = await context.waitForEvent('page', { timeout: 30000 });
                        
                        await newPage2.waitForTimeout(13000); // Ensure SCORM window loads completely

                        // Bring pages to front in correct order
                        await newPage1.bringToFront();
                        const newPage1Title = await newPage1.title();

                        await newPage2.bringToFront();
                        const newPage2Title = await newPage2.title();

                        // Content mismatch validation
                        if (content.trim().toLowerCase() !== newPage1Title.toLowerCase()) {
                            await saveMismatchedScreenshot(newPage2, partner.partnerName, content, i + 1);

                            const imagePath = `./${screenshotPath}`;

                            const { data: { text } } = await Tesseract.recognize(imagePath)

                            let normalizedStr = text.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
                            if (!normalizedStr.includes(content.trim().toLowerCase())) {
                                console.log(`Extracted text: ${normalizedStr} --> Content Title: ${content.trim().toLowerCase()}`);
                                await writeLog(
                                    partner.partnerName,
                                    `❗ Possible mismatch detected: "${content.trim()}" ≠ "${newPage1Title}"`
                                );
                            }
                        } else {
                            await saveScreenshot(newPage2, partner.partnerName, content, i + 1);
                        }

                        // Cleanup - Close popups
                        await newPage2.close();
                        await newPage1.close();
                        await page.getByRole("button", { name: 'Close' }).click();
                    }
                }
                // Close context only after all operations
                await context.close();
            });
        });
    });
});