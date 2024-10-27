import { Locator, Page } from '@playwright/test';

export class LoginPage {
    private page : Page;
    private goToLoginButton: Locator;
    private emailInput: Locator;
    private passwordInput: Locator;
    private continueButton: Locator;
    private loginButton: Locator;
    private userIconOnNavbar : Locator;
    private accLogoutBtn : Locator;
    private logoutConfirmBtn : Locator;

    constructor(page: Page) {
        //Login
        this.page = page;
        this.goToLoginButton = page.locator('[data-uuid$="_login"]');
        this.emailInput = page.locator('[data-testid="username"]');
        this.passwordInput = page.locator('[data-testid="password-container"] input[data-testid="password"]');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        //Logout
        this.userIconOnNavbar = page.getByTestId('header-member-menu-button')
        this.accLogoutBtn = page.getByTestId('account-menu-logout');
        this.logoutConfirmBtn = page.getByTestId('logout-button')
    }
    
    async login(email: any, password: any) {
        await this.page.goto('/')
        await this.goToLoginButton.click();
        await this.emailInput.fill(email);
        await this.continueButton.click();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async logout() {
        await this.userIconOnNavbar.click();
        await this.accLogoutBtn.click();
        await this.logoutConfirmBtn.click();
    }
}

module.exports = {LoginPage};