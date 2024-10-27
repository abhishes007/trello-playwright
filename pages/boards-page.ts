import { Locator, Page, expect } from '@playwright/test';

export class BoardsPage {
    private page : Page;
    private boardsHeader: Locator;
    private listSelector : Locator;
    private listComposerBtn : Locator;
    private listMoveBtn : Locator;
    private listMoveDialog : Locator;
    private listMoveConfirm : Locator;
    private addListItem : Locator;
    private newListTextBox : Locator;
    private addListButton : Locator;
    private taskNameInput: Locator;
    private addTaskBtn : Locator;
    private closeAddTaskBtn : Locator;
    private createTemplateBtn: Locator;
    private templateNameTextbox : Locator;
    private addTemplateCardBtn : Locator;
    private templateTitle : Locator;
    private closeTemplateDialog : Locator;
    private labelBtn : Locator;
    private searchLabelInput : Locator;
    private labelCheckbox : Locator;
    private labelCloseBtn : Locator;
    private labelCardOnTemplate : Locator;
    private checklistBtn : Locator;
    private checklistAddBtn : Locator;
    private checklistTitleInput : Locator;
    private checklistTitle : Locator;
    private checklistOptionAddBtn : Locator;
    private checklistOptionInput: Locator;
    private checklistOptionConfirmBtn : Locator;
    private taskFromTemplateBtn : Locator;
    private templateTaskNameInput: Locator;
    private tempateTaskToListDropdownBtn : Locator;
    private createTaskFromTemplateBtn : Locator;
    private taskFromTemplateTitle : Locator;

    constructor(page : Page) {
        this.page = page;
        //Board
        this.boardsHeader = page.locator('.boards-page-section-header-name');
        //List
        this.listSelector = page.locator('#board > li');
        this.addListItem = page.getByRole('button', { name: 'Add another list'});
        this.listComposerBtn = page.getByTestId('list-composer-button');
        this.newListTextBox = page.getByPlaceholder('Enter list name…');
        this.addListButton = page.getByTestId('list-composer-add-list-button');
        this.listMoveBtn = page.getByTestId('list-actions-move-list-button');
        this.listMoveDialog = page.getByTestId('list-actions-move-list-popover');
        this.listMoveConfirm = page.getByRole('button', { name: 'Move' })
        //Task
        this.taskNameInput = page.getByTestId('list-card-composer-textarea');
        this.addTaskBtn = page.getByTestId('list-card-composer-add-card-button');
        this.closeAddTaskBtn = page.getByTestId('list-card-composer-cancel-button');
        //Template
        this.createTemplateBtn = page.getByTestId('create-new-template-card-button');
        this.templateNameTextbox = page.getByTestId('create-template-card-composer');
        this.addTemplateCardBtn = page.getByTestId('new-template-card-submit-button')
        this.templateTitle = page.getByTestId('card-back-title-input');
        this.closeTemplateDialog = page.getByLabel('Close dialog');
        //Template Label
        this.labelBtn = page.getByTestId('card-back-labels-button');
        this.searchLabelInput = page.getByPlaceholder('Search labels…');
        this.labelCheckbox = page.getByTestId('clickable-checkbox');
        this.labelCloseBtn = page.getByTestId('popover-close');
        this.labelCardOnTemplate = page.getByTestId('compact-card-label');
        //Checklist in Template
        this.checklistBtn = page.getByTestId('card-back-checklist-button');
        this.checklistTitleInput = page.getByLabel('Title', { exact: true });
        this.checklistAddBtn = page.getByRole('button', { name: 'Add', exact: true });
        this.checklistTitle = page.getByTestId('checklist-title-container');
        this.checklistOptionAddBtn = page.getByRole('button', { name: 'Add an item' });
        this.checklistOptionInput = page.getByTestId('check-item-name-input');
        this.checklistOptionConfirmBtn =  page.getByTestId('check-item-add-button');
        //Task using Template
        this.taskFromTemplateBtn = page.getByTestId('create-card-from-template-banner-button');
        this.templateTaskNameInput = page.getByTestId('card-title-textarea');
        this.tempateTaskToListDropdownBtn = page.getByLabel('open', { exact: true });
        this.createTaskFromTemplateBtn = page.getByTestId('create-card-from-template-button');
        this.taskFromTemplateTitle = page.getByTestId('card-back-title-input');
    }

    async getListSelector() {
        return this.listSelector;
    }

    async getListCount() {
        const count = this.listSelector.count();
        return count;
    }

    async verifyBoardsHeader(boardHeader : string): Promise<void> {
        await expect(this.boardsHeader).toHaveText(boardHeader);
    }

    async navigateToTaskBoard(boardName: string) : Promise<void> {
        await this.page.getByRole('link', { name: `${boardName}` }).first().click();
        await this.page.waitForLoadState('networkidle');
    }

    async addNewList(listName : string) {
        await this.listComposerBtn.click();
        await this.newListTextBox.click();
        await this.newListTextBox.fill(listName);
        await this.addListButton.click();
    }

    async verifyAddedList(listName : string) {
        await expect(this.page.locator('li').filter({ hasText: `${listName}` })).toBeVisible()
    }

    async moveListToPosition(listName : string, currentPosition : string, moveToPosition : number) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByTestId('list-edit-menu-button').click();
        await this.listMoveBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.listMoveDialog).toBeVisible();
        await this.page.locator('div').filter({ hasText: `^${currentPosition}$` }).getByLabel('open').click();
        await this.page.getByRole('option', { name: `${moveToPosition}` }).getByRole('listitem').click();
        await this.listMoveConfirm.click();
    }

    async addTaskCard(listName : string, taskName: string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByTestId('list-add-card-button').click();
        await this.taskNameInput.click();
        await this.taskNameInput.fill(taskName);
        await this.addTaskBtn.click();
        await this.closeAddTaskBtn.click();
    }

    async createTaskTemplate(listName : string, templateName: string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByTestId('card-template-list-button').click();
        await this.createTemplateBtn.click();
        await this.templateNameTextbox.click();
        await this.templateNameTextbox.fill(templateName);
        await this.addTemplateCardBtn.click();
        await expect(this.templateTitle).toHaveText(templateName);
        await this.closeTemplateDialog.click();
    }

    async verifyTaskTemplateAdded(listName: string, templateName: string) {
        await expect(this.page.locator('li').filter({ hasText: `${listName}` }).getByText(templateName)).toBeVisible();
    }

    async addLabelToTaskTemplate(listName: string, templateName: string, labelColor : string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByText(templateName).click();
        await this.labelBtn.click();
        await this.searchLabelInput.fill(labelColor);
        await this.labelCheckbox.check();
        await this.labelCloseBtn.click();
        //await this.labelCardOnTemplate.hover({force: true});
        //await expect(this.page.getByRole('tooltip', { name: `Color: ${labelColor}, title: none` })).toBeVisible();
        await this.closeTemplateDialog.click();
    }

    async verifyLabelAddedToTemplate(labelColor : string) {
        await this.labelCardOnTemplate.hover();
        await expect(this.page.getByLabel(`Color: ${labelColor}, title: none`)).toBeVisible();
    }

    async addChecklistToTemplate(listName : string, templateName : string, checklist : string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByText(templateName).click();
        await this.checklistBtn.click();
        await this.checklistTitleInput.click();
        await this.checklistTitleInput.clear();
        await this.checklistTitleInput.fill(checklist);
        await this.checklistAddBtn.click();
        await expect(this.checklistTitle).toHaveText(checklist);
        await this.closeTemplateDialog.click();
    }

    async addOptionsToChecklist(listName: string, templateName : string, checklistOption : string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByText(templateName).click();
        await this.checklistOptionAddBtn.click();
        await this.checklistOptionInput.fill(checklistOption);
        await this.checklistOptionConfirmBtn.click();
        await expect(this.page.getByRole('button', { name: `${checklistOption}` })).toBeVisible();
        await this.closeTemplateDialog.click();
    }

    async verifyChecklistOptionsAdded(listName: string, checklistText) {
        await expect(this.page.locator('li').filter({ hasText: `${listName}`}).getByTestId('checklist-badge')).toHaveText(checklistText);
    }

    async createTaskFromTemplate(templatelistName: string, templateName: string, taskName: string, toListName : string) {
        await this.page.locator('li').filter({ hasText: `${templatelistName}` }).getByText(templateName).click();
        await expect(this.templateTitle).toHaveText(templateName);
        await this.taskFromTemplateBtn.click();
        await this.templateTaskNameInput.click();
        await this.templateTaskNameInput.clear();
        await this.templateTaskNameInput.fill(taskName);
        await this.tempateTaskToListDropdownBtn.click();
        await this.page.getByRole('option', { name: `${toListName}` }).getByRole('listitem').click();
        await this.createTaskFromTemplateBtn.click();
        await expect(this.taskFromTemplateTitle).toHaveText(taskName);
        await this.closeTemplateDialog.click();
    }

    async verifyTaskFromTemplateAdded(listName : string, taskFromTemplate : string) {
        expect(this.page.locator('li').filter({ hasText: `${listName}` }).getByText(taskFromTemplate)).toBeVisible();
    }

    async markCheckListItem(listName : string, taskFromTemplate : string, checkListItem : string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByText(taskFromTemplate).click();
        await expect(this.taskFromTemplateTitle).toHaveText(taskFromTemplate);
        await this.page.locator('li').filter({ hasText: `${checkListItem}` }).getByTestId('clickable-checkbox').check()
        await this.closeTemplateDialog.click();
    }

    async openTemplateTask(listName : string, templateName: string) {
        await this.page.locator('li').filter({ hasText: `${listName}` }).getByText(templateName).click();
        await expect(this.templateTitle).toHaveText(templateName);
    }

    async editTaskCheckListOrder(listName : string, templateName : string, dragItem : string, dropItem : string) {
        //await this.page.locator('li').filter({ hasText: `${listName}` }).getByText(templateName).click();
        await this.page.getByRole('button', { name: `${dragItem}` }).scrollIntoViewIfNeeded();
        await this.page.getByRole('button', { name: `${dragItem}` }).hover();
        await this.page.mouse.down();
        await this.page.getByRole('button', { name: `${dropItem}` }).hover()
        await this.page.getByRole('button', { name: `${dropItem}` }).hover();
        await this.page.mouse.up();
    }
}

module.exports = {BoardsPage}