import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { BoardsPage } from '../pages/boards-page';
import dotenv from 'dotenv';
const { APIUtils } = require('../utils/APIUtils');
const testData = JSON.parse(JSON.stringify(require('../utils/testdata.json')));


dotenv.config();

const email = process.env.TRELLO_EMAIL;
const password = process.env.TRELLO_PASSWORD;
const token = `${process.env.API_TOKEN}`
const key = `${process.env.API_KEY}`

let sessionContext, boardId;

test.beforeAll("Test Setup", async({browser}) => {
    //Use API to create a board
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext);
    const createBoardResp = await apiUtils.createBoard(key, token, testData.taskboard.name, false);
    await expect(createBoardResp).toBeOK();
    boardId = await apiUtils.getBoardId(key, token);
    //Use API to create the intial List on board.
    const listNames = [testData.list.done, testData.list.inProgress, testData.list.todo];
    for(const listName of listNames) {
        await apiUtils.createList(boardId, listName, key, token);
    }
    //Set browser context and store in a JSON file to use for session context.
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page)
    //Login first to create browser state
    await loginPage.login(email, password);
    await context.storageState({path: 'state.json'});
    sessionContext = await browser.newContext({ storageState : 'state.json'});
})

test('Go to Board and Create create BackLog list using UI', async() => {
    //Initialize browser with state stored in JSON file.
    const page = await sessionContext.newPage();
    const boardsPage = new BoardsPage(page);
    await page.goto('/');
    //Navigate to Task Board
    await boardsPage.navigateToTaskBoard(testData.taskboard.name);
    //Get list count before creating new list
    let listCount = await boardsPage.getListCount();
    console.log(listCount);
    expect(listCount).toBe(3);
    //Add new list and verify count again
    await boardsPage.addNewList(testData.list.backlog);
    await boardsPage.verifyAddedList(testData.list.backlog);
    //await boardsPage.moveListToPosition(testData.list.backlog, 'Position4', 1);
    listCount = await boardsPage.getListCount();
    expect(listCount).toBe(4);
    await page.close()
})

test('Add Tasks to To-Do List', async() => {
    //Initialize browser with state stored in JSON file.
    const page = await sessionContext.newPage();
    const boardsPage = new BoardsPage(page);
    await page.goto('/');
    //Navigate to Task Board
    await boardsPage.navigateToTaskBoard(testData.taskboard.name);
    //Add Tasks and verify if they are visible on the board.
    await boardsPage.addTaskCard(testData.list.todo, testData.tasks.task1);
    await expect(page.getByRole('link', { name: `${testData.tasks.task1}` })).toBeVisible();
    await boardsPage.addTaskCard(testData.list.todo,testData.tasks.task2);
    await expect(page.getByRole('link', { name: `${testData.tasks.task2}` })).toBeVisible();
    await boardsPage.addTaskCard(testData.list.todo,testData.tasks.task3);
    await expect(page.getByRole('link', { name: `${testData.tasks.task3}` })).toBeVisible();
    await page.close()
})

test('Drag and Drop task from one list to another', async() => {
    //Initialize browser with state stored in JSON file.
    const page = await sessionContext.newPage();
    const boardsPage = new BoardsPage(page);
    await page.goto('/');
    //Navigate to Task Board
    await boardsPage.navigateToTaskBoard(testData.taskboard.name);
    //Verify Task 2 is under To-Do List First
    await expect(page.locator('li').filter({ hasText: `${testData.list.todo}` }).getByText(testData.tasks.task2)).toBeVisible();
    //Drag and Drop Task 2
    await page.getByText(testData.tasks.task2).dragTo(page.locator('li').filter({ hasText: `${testData.list.inProgress}` }));
    //Verify Task  is now in In-Progress
    await expect(page.locator('li').filter({ hasText: `${testData.list.inProgress}` }).getByText(testData.tasks.task2)).toBeVisible();
    await expect(page.locator('li').filter({ hasText: `${testData.list.todo}` }).getByText(testData.tasks.task2)).not.toBeVisible();
    //Verify Task 3 is under To-Do List First
    await expect(page.locator('li').filter({ hasText: `${testData.list.todo}` }).getByText(testData.tasks.task3)).toBeVisible();
    //Drag and Drop Task 3
    await page.getByText(testData.tasks.task3).dragTo(page.locator('li').filter({ hasText: `${testData.list.done}` }));;
    //Verify Task 3 is now in In-Progress
    await expect(page.locator('li').filter({ hasText: `${testData.list.done}` }).getByText(testData.tasks.task3)).toBeVisible();
    await expect(page.locator('li').filter({ hasText: `${testData.list.todo}` }).getByText(testData.tasks.task2)).not.toBeVisible();
    await page.close()
})

test('Create Template for Task', async() => {
    //Initialize browser with state stored in JSON file.
    const page = await sessionContext.newPage();
    const boardsPage = new BoardsPage(page);
    await page.goto('/');
    //Navigate to Task Board
    await boardsPage.navigateToTaskBoard(testData.taskboard.name);
    //Create template for task
    await boardsPage.createTaskTemplate(testData.list.todo, testData.template.name);
    await boardsPage.verifyTaskTemplateAdded(testData.list.todo, testData.template.name);
    //Add label to template
    await boardsPage.addLabelToTaskTemplate(testData.list.todo, testData.template.name, testData.template.label);
    await boardsPage.verifyLabelAddedToTemplate(testData.template.label);
    //Add checklist and checklist items to template
    await boardsPage.addChecklistToTemplate(testData.list.todo, testData.template.name, testData.template.checkList);
    await boardsPage.addOptionsToChecklist(testData.list.todo, testData.template.name, testData.checklistItems.item1);
    await boardsPage.addOptionsToChecklist(testData.list.todo, testData.template.name, testData.checklistItems.item2);
    await boardsPage.addOptionsToChecklist(testData.list.todo, testData.template.name, testData.checklistItems.item3);
    //Verify checklist items added
    await boardsPage.verifyChecklistOptionsAdded(testData.list.todo, '0/3');
    await page.close()
})

test('Create Task from Template', async() => {
    //Initialize browser with state stored in JSON file.
    const page = await sessionContext.newPage();
    const boardsPage = new BoardsPage(page);
    await page.goto('/');
    //Navigate to Task Board
    await boardsPage.navigateToTaskBoard(testData.taskboard.name);
    //Create task from template
    await boardsPage.createTaskFromTemplate(testData.list.todo, testData.template.name, testData.taskFromTemplate.name, testData.list.done);
    await boardsPage.verifyTaskFromTemplateAdded(testData.list.done, testData.taskFromTemplate.name);
    //Mark checklist option as done and verify
    await boardsPage.markCheckListItem(testData.list.done, testData.taskFromTemplate.name, testData.checklistItems.item2);
    await boardsPage.verifyChecklistOptionsAdded(testData.list.done, '1/3');
    await page.close()
})

test('Edit Task checklist item order', async() => {
    //Initialize browser with state stored in JSON file.
    const page = await sessionContext.newPage();
    const boardsPage = new BoardsPage(page);
    await page.goto('/');
    //Navigate to Task Board
    await boardsPage.navigateToTaskBoard(testData.taskboard.name);
    //Edit Task Template
    await boardsPage.openTemplateTask(testData.list.todo, testData.template.name);
    await page.getByTestId("checklist-items").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("checklist-items").locator('li').nth(1)).toHaveText('Option2');
    await boardsPage.editTaskCheckListOrder(testData.list.todo, testData.template.name, testData.checklistItems.item3, testData.checklistItems.item2);
    await expect(page.getByTestId("checklist-items").locator('li').nth(1)).toHaveText('Option3');
    await page.close()
})

test.afterAll("Tear Down", async() => {
    //Logout:
    const page = await sessionContext.newPage();
    const loginPage = new LoginPage(page);
    await page.goto('/');
    await loginPage.logout();
    await expect(page.getByTestId('bignav').getByRole('link', { name: 'Log in' })).toBeVisible();
    await page.close();
    
    //Delete the created board.
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext);
    const deletedResponse = await apiUtils.deleteBoard(boardId, key, token);
    expect (deletedResponse).toBeOK();
})