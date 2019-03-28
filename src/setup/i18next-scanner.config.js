// https://github.com/i18next/i18next-scanner/

module.exports = {
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't', 'props.t'],
      extensions: ['.js'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js'],
      fallbackKey: false,
    },
    defaultLng: 'en',
    defaultNs: 'settings',
    defaultValue: '',
    resource: {
      loadPath: 'static/locales/{{lng}}/{{ns}}.json',
      savePath: 'static/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '',
    },
    nsSeparator: ':::',
    keySeparator: '::',
    pluralSeparator: '_',
    contextSeparator: '_',
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};
