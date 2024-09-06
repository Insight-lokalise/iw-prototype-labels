export const countryMap = (salesAreaObj) => {
  const salesList = Object.keys(salesAreaObj).map(key => {
    const locale = salesAreaObj[key].split('_')[1]
    return {locale: locale.toLowerCase(), salesOrg: key}
  })
  return salesList
}

export const country = {
  us: 'US Enrolments',
  at: 'Austria',
  be: 'Belgium',
  dk: 'Denmark',
  fr: 'France',
  de: 'Germany',
  ie: 'Ireland',
  it: 'Italy',
  nl: 'Netherlands',
  no: 'Norway',
  es: 'Spain',
  se: 'Sweden',
  ch: 'Switzerland',
  gb: 'United Kingdom'
}

export const BASE_URL = '/insightweb'
export const requestDefaultHeaders = {
  'Accept': 'application/json; charset=UTF-8',
  'Content-Type': 'application/json; charset=UTF-8'
}

export const approver = 'approver'
export const edit = 'edit'
export const read = 'readOnly'


