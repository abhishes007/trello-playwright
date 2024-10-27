import dotenv from 'dotenv';
dotenv.config();

export class APIUtils {
  apiContext: any;

  constructor(apiContext: any) {
    this.apiContext = apiContext;
  }

  async getBoardId(apiKey: string, apiToken: string) {
    const url = `${process.env.API_URL}/1/members/me/boards?key=${apiKey}&token=${apiToken}`
    const response = await this.apiContext.get(url, {
      headers: {
        Accept: 'application/json'
      }
    })
    const responseJson = await response.json();
    const boardId = responseJson[0].id;
    return boardId;
  }

  async createBoard(apiKey: string, apiToken: string, name: string, defaultLists : boolean) {
    const url = `${process.env.API_URL}/1/boards/`;
    const response = await this.apiContext.post(url, {
      headers: {
        Accept: 'application/json',
      },
      params: {
        name,
        key: apiKey,
        token: apiToken,
        defaultLists: defaultLists
      },
    });
    return response;
  }

  async createList(boardId: string, listName: string, key: string, token: string) {
    const url = `${process.env.API_URL}/1/boards/${boardId}/lists?name=${listName}&key=${key}&token=${token}`
    const response = await this.apiContext.post(url, {
        headers: {
            Accept: 'application/json',
        },
    });
    return response;
  }
  async deleteBoard(boardId: string, key: string, token: string) {
    const url = `${process.env.API_URL}/1/boards/${boardId}?key=${key}&token=${token}`;
    const response = await this.apiContext.delete(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    return response;
  }
}

module.exports = { APIUtils };
