const LANGUAGE_COOKIE = 'user_language'
const USER_DETAILS_COOKIE = 'user_details'
const SESSION_NAME = 'command_session'

const envMap = {
  development: 'dev',
  qa: 'qa',
  production: 'prod'
}
const ENV = envMap[process.env.BUILD_ENV || 'development']

const TRANSLATIONS_BASE_URL =
  ENV !== 'prod'
    ? `https://${ENV}-kong.command-api.kw.com/translation/api/v1`
    : 'https://kong.command-api.kw.com/translation/api/v1'

module.exports = {
  SESSION_NAME,
  LANGUAGE_COOKIE,
  USER_DETAILS_COOKIE,
  TRANSLATIONS_BASE_URL
};