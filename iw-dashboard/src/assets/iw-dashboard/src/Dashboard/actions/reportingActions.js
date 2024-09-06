import {
  SAVE_SBMANUFACTURER,
  GET_SBMANUFACTURER,
  SAVE_SBPRODUCT,
  GET_SBPRODUCT,
  EXISTS_SBPRODUCT_DATA,
  EXISTS_SBMANUFACTURER_DATA,
} from '../actionTypes'
import { SBBILLING, SBSHIPPING, SBPRODUCT, SBMANUFACTURER } from '../components/constants'
import { selector_prevAPICalls, selector_SBProduct, selector_SBManufacturer } from '../selectors/reportingSelectors'
import { fetchReportingData } from '../../services'

/**
 * Gets raw data for sbMonth, sbBillingCountry, sbShippingCountry, & sbRegion
 * @param  {String} currencyCode 3-letter currency code
 * @param  {String} type         indicates which dashlet is being populated
 * @return {Action}
 */
export function getSBStandard(currencyCode, type) {
  return (dispatch, getState) => {
    if (selector_prevAPICalls(getState(), type)[currencyCode]) {
      dispatch({ type: `${type.toUpperCase()}_DATA_EXISTS` })
      return
    }
    const getType = `GET_${type.toUpperCase()}`
    const saveType = `SAVE_${type.toUpperCase()}`
    const spending = (type === SBBILLING && 'bill') || (type === SBSHIPPING && 'ship') || 'sales'
    const fetchPath = `getSpentByMonth/${spending}/${currencyCode}`
    dispatch({ type: getType })
    fetchReportingData(fetchPath).then(response => {
      dispatch(saveSBStandard(currencyCode, response.data, saveType))
    })
  }
}
/**
 * Saves raw data for sbMonth, sbBillingCountry, sbShippingCountry, & sbRegion
 * @param  {String} currencyCode 3-letter currency code
 * @param  {Object} data         Contains items and currencies arrays
 * @param  {String} type         indicates which dashlet is being populated
 * @return {Action}
 */
function saveSBStandard(currencyCode, data, type) {
  const { items, currencies } = data
  const payload = {
    [currencyCode]: items,
    currencies: prepareForIWSelect(currencies),
    hasData: true,
    initialLoad: true,
  }
  return { type, payload }
}

/**
 * Gets raw data for sbProductCategory and sbManufacturer
 * @param  {String} fetchPath Unique path for the api call
 * @return {Action}
 */
export function getSBProduct(fetchPath) {
  return (dispatch, getState) => {
    if (selector_SBProduct(getState(), fetchPath)) {
      dispatch({ type: EXISTS_SBPRODUCT_DATA })
      return
    }
    dispatch({ type: GET_SBPRODUCT })
    fetchReportingData(fetchPath).then(response => {
      dispatch(saveSBProduct(fetchPath, response.data))
    })
  }
}
/**
 * Saves raw data for sbProductCategory and sbManufacturer
 * @param  {String} fetchPath Unique path for the api call
 * @param  {[type]} data      contains the items (array), currencies (array), & locations (object) properties
 * @return {Action}
 */
function saveSBProduct(fetchPath, data) {
  return (dispatch, getState) => {
    const { items, locations } = data
    const currencies = prepareCurrencies(getState, SBPRODUCT, data.currencies)
    const payload = {
      [fetchPath]: items,
      currencies,
      hasData: true,
      initialLoad: true,
    }
    const sbProductData = getState().SBProduct
    if (!sbProductData || !sbProductData.regions) {
      const regions = Object.keys(locations)
      const countries = { all: {} }
      regions.forEach(region => {
        countries[region] = prepareForIWSelect(locations[region])
        locations[region].forEach(country => {
          if (!countries.all[country]) countries.all[country] = true
        })
      })
      countries.all = prepareForIWSelect(Object.keys(countries.all))
      payload.regions = prepareForIWSelect(regions)
      payload.countries = countries
    }
    dispatch({ type: SAVE_SBPRODUCT, payload })
  }
}

/**
 * Gets raw data for sbManufacturer
 * @param  {String} fetchPath Unique path for the api call
 * @return {Action}
 */
export function getSBManufacturer(fetchPath) {
  return (dispatch, getState) => {
    if (selector_SBManufacturer(getState(), fetchPath)) {
      dispatch({ type: EXISTS_SBMANUFACTURER_DATA })
      return
    }
    dispatch({ type: GET_SBMANUFACTURER })
    fetchReportingData(fetchPath).then(response => {
      dispatch(saveSBManufacturer(fetchPath, response.data))
    })
  }
}
/**
 * Saves raw data for sbManufacturer
 * @param  {String} fetchPath Unique path for the api call
 * @param  {[type]} data      contains the items (array) & currencies (array) properties
 * @return {Action}
 */
function saveSBManufacturer(fetchPath, data) {
  return (dispatch, getState) => {
    const { items, manufacturers } = data
    const currencies = prepareCurrencies(getState, SBMANUFACTURER, data.currencies)
    const payload = {
      [fetchPath]: items,
      currencies,
      hasData: true,
      initialLoad: true,
    }
    if (manufacturers) {
      payload.manufacturers = prepareForIWSelect(manufacturers)
    }
    dispatch({ type: SAVE_SBMANUFACTURER, payload })
  }
}

/**
 * Takes an array of strings and preps it to be the options props for IWSelect
 * @param  {Array} listArray Array of strings
 * @return {Array}           Array of objects of the format: { value: STRING, label: STRING }
 */
function prepareForIWSelect(listArray) {
  return listArray.map(value => ({ value, label: value }))
}
/**
 * Maintains older currency arrays if they are longer than newer currency arrays
 * @param  {Function} getState   Gets the current redux state when implemented
 * @param  {String}   type       The type of dashlet
 * @param  {Array}    currencies List of currency codes from response
 * @return {Array}               Prepared list of currency codes to be saved to redux
 */
function prepareCurrencies(getState, type, currencies) {
  const oldCurrencies = selector_prevAPICalls(getState(), type).currencies
  const newCurrencies = prepareForIWSelect(currencies)
  const stopCurrencyUpdate = oldCurrencies && oldCurrencies.length >= newCurrencies.length
  return stopCurrencyUpdate ? oldCurrencies : newCurrencies
}
