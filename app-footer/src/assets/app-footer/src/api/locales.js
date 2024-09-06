export const INSIGHT_LOCALE_COOKIE_NAME = 'insight_locale'
export const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = 'insight_current_locale'

export const LANGUAGES = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands',
  sv: 'Svenska',
  zh: '中文简体',
}

// todo: swap emea countries to this as part of EMEA onboarding
const EMEA_SUFFIXES = {
  de: '',
  en: '',
  es: '',
  fr: '',
  it: '',
  nl: '',
  sv: '',
}

const EMEA_LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'nl', 'sv']

const US_APAC_ENGLISH_ONLY_SUFFIXES = {
  en: '',
}

// For each country:
//  - url: The base url of the production site for that country.
//  - label: The label displayed in the country selector.
//  - default: The language selected by default for the country.
//  - languages: The list of languages shown as options for the country.
//  - suffixes: A mapping from languages to site suffixes, e.g. 'en' => '/en-gb'
export const COUNTRIES = {
  at: {
    url: '//at.insight.com',
    label: 'Austria',
    default: 'de',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-AT',
    siteId: 10,
  },
  au: {
    url: '//au.insight.com',
    label: 'Australia',
    default: 'en',
    languages: ['en'],
    suffixes: US_APAC_ENGLISH_ONLY_SUFFIXES,
    name: 'APAC-AU',
    siteId: 29,
  },
  be: {
    url: '//be.insight.com',
    label: 'Belgium',
    default: 'en',
    suffixes: EMEA_SUFFIXES,
    languages: EMEA_LANGUAGES,
    name: 'EMEA-BE',
    siteId: 11,
  },
  ca: {
    url: '//ca.insight.com',
    label: 'Canada',
    default: 'en',
    languages: ['en', 'fr'],
    suffixes: { en: 'en', fr: 'fr' },
    name: 'NA-CA',
    siteId: 26,
  },
  ch: {
    url: '//ch.insight.com',
    label: 'Switzerland',
    default: 'de',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-CH',
    siteId: 12,
  },
  cn: {
    url: '//cn.insight.com',
    label: 'China',
    default: 'en',
    languages: ['en', 'zh'],
    suffixes: { en: 'en', zh: 'zh' },
    name: 'APAC-CN',
    siteId: 30,
  },
  de: {
    url: '//www.insight.de',
    label: 'Germany',
    default: 'de',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-DE',
    siteId: 7,
  },
  dk: {
    url: '//dk.insight.com',
    label: 'Denmark',
    default: 'en',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-DK',
    siteId: 14,
  },
  es: {
    url: '//es.insight.com',
    label: 'Spain',
    default: 'es',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-ES',
    siteId: 15,
  },
  fr: {
    url: '//fr.insight.com',
    label: 'France',
    default: 'fr',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-FR',
    siteId: 5,
  },
  gb: {
    url: '//uk.insight.com',
    label: 'United Kingdom',
    default: 'en',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-UK',
    siteId: 3,
  },
  hk: {
    url: '//hk.insight.com',
    label: 'Hong Kong',
    default: 'en',
    languages: ['en'],
    suffixes: US_APAC_ENGLISH_ONLY_SUFFIXES,
    name: 'APAC-HK',
    siteId: 31,
  },
  ie: {
    url: '//ie.insight.com',
    label: 'Ireland',
    default: 'en',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-IE',
    siteId: 18,
  },
  it: {
    url: '//it.insight.com',
    label: 'Italy',
    default: 'it',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-IT',
    siteId: 19,
  },
  nl: {
    url: '//nl.insight.com',
    label: 'Netherlands',
    default: 'nl',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-NL',
    siteId: 4,
  },
  no: {
    url: '//no.insight.com',
    label: 'Norway',
    default: 'en',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-NO',
    siteId: 20,
  },
  nz: {
    url: '//nz.insight.com',
    label: 'New Zealand',
    default: 'en',
    languages: ['en'],
    suffixes: US_APAC_ENGLISH_ONLY_SUFFIXES,
    name: 'APAC-NZ',
    siteId: 32,
  },
  se: {
    url: '//se.insight.com',
    label: 'Sweden',
    default: 'sv',
    languages: EMEA_LANGUAGES,
    suffixes: EMEA_SUFFIXES,
    name: 'EMEA-SE',
    siteId: 23,
  },
  sg: {
    url: '//sg.insight.com',
    label: 'Singapore',
    default: 'en',
    languages: ['en'],
    suffixes: US_APAC_ENGLISH_ONLY_SUFFIXES,
    name: 'APAC-SG',
    siteId: 33,
  },
  us: {
    url: '//www.insight.com',
    label: 'United States',
    default: 'en',
    languages: ['en'],
    suffixes: US_APAC_ENGLISH_ONLY_SUFFIXES,
    name: 'NA-US',
    siteId: 2,
  },
}

// Regions group countries together by geographic areas.
export const REGIONS = [
  {
    label: 'Asia-Pacific',
    countries: ['au', 'cn', 'hk', 'nz', 'sg'],
  },
  {
    label: 'North America',
    countries: ['ca', 'us'],
  },
  {
    label: 'Europe, the Middle East and Africa',
    countries: ['at', 'be', 'dk', 'fr', 'de', 'it', 'ie', 'nl', 'no', 'es', 'se', 'ch', 'gb'],
  },
]

export const REGION_CODE = {
  EMEA: "EMEA",
  APAC: "APAC",
  NA: "NA"
}
