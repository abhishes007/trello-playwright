# Project Setup

This document provides instructions for setting up the project with Playwright, configuring environment variables using dotenv, and running tests.

## Installation

1. **Clone the Git Repository:** 

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2. **Install Playwright:**

    ```bash
    npm init playwright@latest
    ```
3. **Install Dotenv:**

    ```bash
    npm i dotenv
    ```
## Setting up Environment Variables

1. Rename the **.dummy-env** file to **.env**
2. Add your Trello credentials, key and token to the file.

    ```
    API_KEY=your_trello_api_key
    API_TOKEN=your_trello_token
    TRELLO_EMAIL=your_trello_email
    TRELLO_PASSWORD=your_trello_password
    ```

## Running Test:

1. Run Tests in Headless mode:

    ```bash
    npx playwright test 
        or
    npm run runTest-headless
    ```
2. Run Tests in Headed
    ```bash
    npx playwright test --headed
        or
    npm run runTest-headed
    ```
