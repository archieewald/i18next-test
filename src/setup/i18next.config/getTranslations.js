const Cookies = require('js-cookie');
const axios = require('axios');
const {
  USER_DETAILS_COOKIE,
  SESSION_NAME,
  LANGUAGE_COOKIE,
  TRANSLATIONS_BASE_URL,
} = require('../../constants');

let firstRender = true;
let languageList = [];

const switchFlag = () => {
  if (firstRender) {
    firstRender = false;
  }
  return firstRender;
};

const getUserToken = () => {
  const session = Cookies.getJSON(SESSION_NAME);
  const { access_token } = session ? session : {};
  return access_token;
};

/**
 * Get ORG settings which are base to define user language id
 */
const getORGSettings = () => {
  const { orgs } = Cookies.getJSON(USER_DETAILS_COOKIE);
  const orgId = orgs && orgs.length ? orgs[0].org_id : null;
  if (orgId && firstRender) {
    return axios
      .get(`${TRANSLATIONS_BASE_URL}/orgs/${orgId}/languages`, {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
      })
      .then(response => {
        const {
          data: { data },
        } = response;
        languageList = data;
        return data;
      })
      .catch(error => {
        if (error.response.status !== 404) {
          console.error(
            `Error occurred during fetch language settings, ${error}`
          );
        }
        return [];
      });
  }
  return new Promise(resolve => resolve(languageList));
};

/**
 * Generate user language id based on given ORG settings
 */
const getLanguageId = options => {
  const { language_id: languageId } = Cookies.getJSON(LANGUAGE_COOKIE) || {};
  const doesOptionExist = options
    .map(({ language_id }) => language_id)
    .includes(languageId);
  /**
   * Take language_id from cookies if it is on ORG settings list
   */
  if (languageId && doesOptionExist) {
    return String(languageId);
  }

  /**
   * Take language_id from ORG settings list if cookie not match or not defined
   */
  if (options.length) {
    const defaultLanguage = options.find(lng => lng.is_default);
    return String(defaultLanguage.language_id);
  }
  return '';
};

const getTranslations = url =>
  getORGSettings().then(orgSettings => {
    switchFlag();
    return axios({
      url: `${url}?language_id=${getLanguageId(orgSettings)}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      },
    });
  });

module.exports = { getTranslations, getLanguageId, getORGSettings };
