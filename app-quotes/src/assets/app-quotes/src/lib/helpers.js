import { getCurrentLocale } from '@insight/toolkit-utils'
import { parseISO } from 'date-fns'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../constants'

export function isQuoteExpired(quoteExpiryDate) {
  const expiryDate = new Date(quoteExpiryDate)
  const expDay = expiryDate.getDate()
  const expMonth = expiryDate.getMonth() + 1
  const expYear = expiryDate.getFullYear()
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  return (
    currentYear > expYear ||
    (currentYear === expYear &&
      currentMonth === expMonth &&
      currentDay > expDay) ||
    (currentYear === expYear && currentMonth > expMonth)
  )
}

export function isItemInvalid({ materialInfo }) {
  if (!materialInfo) return false
  if (!materialInfo.active) return true

  return false
}

export const getCountryCode = () => {
  const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const countryCode = currentLocale.split('_')[1].toUpperCase()
  return countryCode
}

export const shippingCarrier = (shippingCarriers, cartShipping) => {
  if (!shippingCarriers || !shippingCarriers?.carriers?.length) return []
  // Create an array of all available carriers
  const allCarriers = [
    ...shippingCarriers?.slsCarriers,
    ...shippingCarriers?.carriers,
  ].map((carrier) => ({
    ...carrier,
    text: carrier.conditionDescription,
    value: carrier.carrierId,
  }))
  // Get the default carrier
  const defaultCarrier = allCarriers.find(
    (carrier) => carrier.defaultCarrier === true
  )
  let shippingCarrier
  // Check if the default carrier is equal to the shopping request carrier
  if (
    cartShipping?.carrier?.name &&
    cartShipping?.carrier?.name === defaultCarrier?.carrier
  ) {
    // Find shipping carrier option in carriers list
    shippingCarrier = allCarriers.find(
      ({ carrier, conditionDescription }) =>
        carrier === cartShipping?.carrier.name &&
        conditionDescription === cartShipping?.carrier.description
    )
  }
  // Check if shopping cart has a selected shipping carrier or set to default carrier
  if (!shippingCarrier) shippingCarrier = defaultCarrier
  // Group carriers by carrier name
  const carrierTabData = groupByCarrier(allCarriers, 'carrier')
  // Normalize the selected carrier name
  const selectedTabName = shippingCarrier?.carrier?.toUpperCase()
  // Get selected carrier from grouped carriers
  let availableCarriers = null
  Object.keys(carrierTabData).map((carrier) => {
    if (selectedTabName && selectedTabName === carrier.toUpperCase()) {
      availableCarriers = carrierTabData[selectedTabName]
    }
  })
  // Find the selected carrier option using the shipping carrier
  const foundCarrierOption = availableCarriers?.find(
    ({ carrier, conditionDescription }) =>
      carrier === shippingCarrier?.carrier &&
      conditionDescription === shippingCarrier?.conditionDescription
  )
  // Set default carrier to found carrier or the first carrier
  const selectedCarrier = foundCarrierOption || availableCarriers?.[0]
  return { availableCarriers, selectedCarrier }
}

export const groupByCarrier = (arr, criteria) => {
  return arr.reduce(function (obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    let key = typeof criteria === 'function' ? criteria(item) : item[criteria]
    // Normalize the key to uppercase
    key = key.toUpperCase()
    // If the key doesn't exist yet, create it
    if (!obj.hasOwnProperty(key)) {
      obj[key] = []
    }

    // Push the value to the object
    obj[key].push(item)

    // Return the object to the next item in the loop
    return obj
  }, {})
}

/**
 * Creates a normal value from a source carrier description from either
 * a service or the ShoppingRequest.
 * The value is then stringified for consumption by select field.
 * @return {String}         Stringified {name: String, option: String}
 */
export const normalizeCarrierValue = (carrier) => {
  const carrierValue = {
    name: carrier.carrier || carrier.name,
    option: carrier.shippingCode || carrier.option || carrier.condition,
    saturday: !!(carrier.saturday || Number(carrier.saturdayDelivery)),
  }
  if (!carrierValue.name || !carrierValue.option) return

  return JSON.stringify(carrierValue)
}

export const getSelectedCarrier = (allCarriers, name, code, saturday) => {
  const currentCarrier = allCarriers.find((carrier) => {
    return (
      carrier.carrier == name &&
      carrier.shippingCode === code &&
      (carrier.saturdayDelivery !== '0') === saturday
    )
  })
  return currentCarrier
}

export const getDefaultShippingCarrier = (options, defaultCarrier) => {
  if (defaultCarrier) {
    const carrier = `${defaultCarrier.description}`
    const defaultValue = options.find((option) => option.text === carrier)
    return defaultValue ? defaultValue.value : ''
  } else {
    return options[0].value
  }
}

export const parseDateToISO = (dateString) => {
  //expects dd-MMM-yyyy
  if (!dateString) return

  const months = [
    '',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ]

  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME).replace(
    /_/g,
    '-'
  )

  const [day, monthString, year] = dateString.split('-')
  const month = months
    .indexOf(monthString.toLowerCase())
    .toLocaleString(locale, {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })

  return parseISO(`${year}-${month}-${day}`)
}
