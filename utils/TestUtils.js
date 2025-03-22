const fs = require('fs');

class TestUtils {
    constructor(page) {
        this.page = page;
    }

    static readJsonFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`❌ Error reading JSON file (${filePath}): ${error.message}`);
            return null;
        }
    }

    static writeJsonFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ JSON file saved: ${filePath}`);
        } catch (error) {
            console.error(`❌ Error writing JSON file (${filePath}): ${error.message}`);
        }
    }

    /**
     * Generates a random email address
     * @returns {string} Randomly generated email
     */
    static generateRandomEmail() {
        return `testuser_${Date.now()}@example.com`;
    }

}

module.exports = { TestUtils };
