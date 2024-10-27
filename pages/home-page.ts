import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
    private page : Page;
    private addNewBoardBtn: Locator;
    private createBoardBtn: Locator;
    private newBoardBtn: Locator;
    private newBoardNameInput: Locator;
    private createNewBoardSubmitBtn: Locator;
    private boardTileTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addNewBoardBtn = page.getByTestId('header-create-menu-button');
        this.createBoardBtn = page.getByTestId('header-create-board-button')
        this.newBoardBtn = page.getByTestId('create-board-tile');
        this.newBoardNameInput = page.getByTestId('create-board-title-input');
        this.createNewBoardSubmitBtn = this.page.getByTestId('create-board-submit-button');
        this.boardTileTitle = this.page.locator('.board-tile-details-name');
        
    }

    async createNewBoard(boardName, backgroundColour) {
        await this.addNewBoardBtn.click();
        await this.createBoardBtn.click();
        await this.page.locator(`button[title="${backgroundColour}"]`).click()
        await this.newBoardNameInput.fill(boardName);
        await this.createNewBoardSubmitBtn.waitFor({state: 'attached'})
        await this.createNewBoardSubmitBtn.click()
        await this.page.waitForURL(`**/${boardName.replace(' ', '-').toLowerCase()}`)
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = {HomePage}