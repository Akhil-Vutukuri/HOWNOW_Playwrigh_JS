class LoginPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL; // ✅ Store baseURL in class
        this.username = page.locator('#user_email');
        this.password = page.locator('#user_password');
        this.loginButton = page.locator("//input[@value='Login']");
    }

    async navigateToLogin() {
        if (!this.baseURL) {
            throw new Error("❌ BASE_URL is not defined in LoginPage.");
        }
        await this.page.goto(`${this.baseURL}/users/sign_in`, { timeout: 90000 });
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.page.waitForNavigation({ timeout: 90000 });
   }   
}   
module.exports = { LoginPage }; 