import * as axios from 'axios';
import Cookies from 'js-cookie';

import { getLanguageId, getORGSettings } from './getTranslations';

jest.mock('axios');

const cookie = {
  user_language: {
    language_id: 2,
  },
  user_details: {
    orgs: [
      {
        org_id: 123,
      },
    ],
  },
  command_session: 1234,
};
const languageList = [
  {
    language_id: 1,
    locale: 'en',
    is_default: 1,
    language_name: 'English',
  },
  {
    language_id: 2,
    locale: 'de',
    is_default: 0,
    language_name: 'Deutch',
  },
];
const userCookieLanguageID = `${languageList[1].language_id}`;
const userDefaultLanguageID = `${languageList[0].language_id}`;
const noLanguageID = '';

afterEach(() => {
  Cookies.getJSON.mockRestore();
});

describe('getLanguageId', () => {
  it('should return user cookie languge id', () => {
    Cookies.getJSON = jest.fn().mockImplementation(key => cookie[key]);
    const languageId = getLanguageId(languageList);
    expect(languageId).toEqual(userCookieLanguageID);
  });

  it('should return default language id', () => {
    Cookies.getJSON = jest.fn().mockImplementationOnce(() => 3);
    const languageId = getLanguageId(languageList);
    expect(languageId).toEqual(userDefaultLanguageID);
  });

  it('should return empty string', () => {
    Cookies.getJSON = jest.fn().mockImplementation(key => cookie[key]);
    const languageId = getLanguageId([]);
    expect(languageId).toEqual(noLanguageID);
  });
});

describe('getORGSettings', () => {
  it('should return languge list on success', async () => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { data: languageList },
      });
    });
    Cookies.getJSON = jest.fn().mockImplementation(key => cookie[key]);
    const test = await getORGSettings();
    expect(axios.get).toHaveBeenCalled();
    expect(test).toEqual(languageList);
  });

  it('should return empty array on fail', async () => {
    axios.get.mockImplementation(() => {
      return Promise.reject({
        response: { status: 404 },
      });
    });
    Cookies.getJSON = jest.fn().mockImplementation(key => cookie[key]);
    const test = await getORGSettings();
    expect(axios.get).toHaveBeenCalled();
    expect(test).toEqual([]);
  });
});
