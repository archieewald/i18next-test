const NextI18Next = require('next-i18next').default;
const locales = require('./locales');
const { getTranslations } = require('./getTranslations');
const { LANGUAGE_COOKIE, TRANSLATIONS_BASE_URL } = require('../../constants');

const { APP_NAMESPACE, APP_PLATFORM } = process.env;


const TRANSLATIONS_URL = `${
  TRANSLATIONS_BASE_URL
}/translations/{{lng}}/${APP_PLATFORM}/{{ns}}`;

const options = {
  debug: false,
  backend: {
    loadPath: TRANSLATIONS_URL,
    crossDomain: true,
    ajax: (url, options, callback) => {
      getTranslations(url)
        .then(res => {
          callback(JSON.stringify(res.data), { status: 200 });
        })
        .catch(err => {
          console.error(`Error: ${err}`);
          callback(null, { status: err.response.status });
        });
    },
  },
  defaultNS: 'shell',
  ns: ['shell', APP_NAMESPACE],
  otherLanguages: locales,
  fallbackLng: 'en',
  detection: {
    lookupCookie: LANGUAGE_COOKIE,
  },
  nsSeparator: ':::',
  keySeparator: '::',
  ignoreRoutes: ['/_next', '/static', '/', '/health'],
};

module.exports = new NextI18Next(options);
