import { get, post } from './../fetch'
import reduce from 'lodash-es/reduce'
import axios, { GET } from '../../../app/libs/axiosConfig'

export function fetchCountries() {
  return get('/insightweb/getCountries')
}

export function fetchStatesByCountryCode(countryCode) {
  return axios({
    method: GET,
    url: `insightweb/transaction/getStatesByLocale/${countryCode}`,
  })
    .then(({ data }) =>
      countryCode === 'CA' ? data.filter((state) => state.key !== 'ZZ') : data
    )
    .catch((error) => {
      console.warn(`Failed to get states`, error)
    })
}

/**
 * service call to fetch fetchFavoriteAddresses
 * @param  {[type]} address type         [it cn be either shipping or billing]
 * @return {[type]}                    [list of addresses]
 */

export function fetchFavoriteAddresses(
  type = required('Address type is needed for fetching favorite addresses')
) {
  return get(type === 'shipping' ? 'shipping/favorites' : 'billing/favorites')
}

export function createContactAddress(address) {
  // all fields are required even if they are empty or null so I've set
  // some defaults here.
  const defaultBody = {
    addressAlreadyVerified: false,
    allowPrivateShipTo: false,
    attention: '',
    city: '',
    companyName: '',
    country: '',
    ext: '',
    faxNum: '',
    language: '',
    nickNameGiven: '',
    partnerSuite: '',
    phoneNum: '',
    poBox: '',
    poBoxPostalCode: '',
    setNickName: false,
    state: '',
    storeId: '',
    street1: '',
    street2: '',
    street3: '',
    suggestedAddress: {},
    useAsDefaultAddress: false,
    userSelectedAddressType: 'USER_ENTERED_ADDRESS',
    zipCode: '',
  }
  return post(
    'transaction/submitContactAddress',
    normalizeToSAPAddress({
      ...defaultBody,
      ...address,
    })
  )
}

/**
 * [updateAddressFavoriteName  description]
 * @param  {[type]} addressObj [description]
 * @return {[type]}            [description]
 */
export function updateAddressFavoriteName(addressObj) {
  return post('transaction/updateBillShipAddress', addressObj).catch(
    (error) => {
      console.warn('Failed to fetch stored address')
      throw error // re-throw error for initial testing of functionality
    }
  )
}

/**
 * Check whether selected attention or phone or  location id
 * field values were changed and set the overrideAddress flag
 */

export function overrideAddress(selectedAddress, existingAddressAttention) {
  return (
    selectedAddress.address.address3 !== existingAddressAttention.address3 ||
    selectedAddress.attentionLine !== existingAddressAttention.attentionLine ||
    selectedAddress.phone !== existingAddressAttention.phone
  )
}

/**
 * CES: Check whether selected attention or company or phone
 * field values were changed and set the overrideAddress flag
 */

export function overrideAddressSimple(
  selectedAddress,
  existingAddressAttention
) {
  return (
    selectedAddress.companyName !== existingAddressAttention.companyName ||
    selectedAddress.attentionLine !== existingAddressAttention.attentionLine ||
    selectedAddress.phone !== existingAddressAttention.phone
  )
}

/**
 * This normalizes to the output expected by our Purchase Order backend.
 * That shape is described by the PurchaseOrder field maps below.
 */
export function normalizeToPurchaseOrderAddress(address) {
  if (!address) {
    address = {}
  } else {
    address = {
      ...address.address,
      ...address,
    }
  }
  const result = normalizeFromMultipleKeys(purchaseOrderFieldMap, address)
  result.address = normalizeFromMultipleKeys(
    purchaseOrderAddressFieldMap,
    address
  )
  return result
}

/**
 * Keys are the desired output shape and values are the possible keys of the input
 * which map to that output key.
 */
const purchaseOrderAddressFieldMap = {
  address1: [
    'street1',
    'address1',
    'shippingAddress1',
    'billingAddress1',
    'partnerAaddress1',
  ],
  address2: [
    'street2',
    'address2',
    'shippingAddress2',
    'billingAddress2',
    'partnerAddress2',
  ],
  address3: [
    'address3',
    'storedId',
    'shippingAddress3',
    'billingAddress3',
    'partnerAddress3',
    'partnerStoreId',
    'shippingStoreId',
    'billingStoreId',
  ],
  city: ['city', 'shippingCity', 'billingCity', 'partnerCity'],
  state: ['state', 'region', 'shippingState', 'billingState', 'partnerState'],
  zipCode: ['zipCode', 'postalCode', 'partnerZip', 'shippingZip', 'billingZip'],
  zipExt: ['zipExt', 'shippingExt', 'billingExt'],
  countryId: [
    'country',
    'region',
    'countryId',
    'shippingCountry',
    'billingCountry',
    'partnerCountry',
  ],
  county: ['county'], // backend-ignored field
  poBox: ['poBox'], // backend-ignored field,
  dunsNumber: ['dunsNumber'],
  poBoxZipCode: ['poBoxZipCode', 'poBoxPostalCode'], // backend-ignored field
}

const purchaseOrderFieldMap = {
  companyName: [
    'companyName',
    'company',
    'shippingCompany',
    'billingCompany',
    'partnerCompany',
  ],
  attentionLine: [
    'attentionLine',
    'attention',
    'attentionline',
    'shippingName',
    'billingName',
  ],
  phone: ['phone', 'phoneNum', 'shippingPhone', 'billingPhone', 'partnerPhone'],
  notes: ['notes'],
  id: [
    'id',
    'partnerFunction',
    'shippingPartnerFunction',
    'billingPartnerFunction',
  ],
  favoriteName: [
    'favouriteName',
    'nickName',
    'nickNameGiven',
    'shippingFavoriteName',
    'favoriteName',
  ],
  overrideAddress: ['overrideAddress'],
}

/**
 * Normalize an address to the shape expected by SAP-using services.
 * @return {[type]}         see SAPAddressFieldMap for structure
 */
export function normalizeToSAPAddress(address) {
  if ('address' in address) {
    address = {
      ...address.address,
      ...address,
    }
  }
  return normalizeFromMultipleKeys(SAPAddressFieldMap, address)
}

/**
 * Used to create a standard SAP address (or at least the request structure
 * expected by a POST to transaction/addContactAddress)\
 *
 * mapps from possible inputs (values) to the expected structure (keys)
 */
const SAPAddressFieldMap = {
  street1: [
    'street1',
    'address1',
    'shippingAddress1',
    'billingAddress1',
    'partnerAaddress1',
  ],
  street2: [
    'street2',
    'address2',
    'shippingAddress2',
    'billingAddress2',
    'partnerAddress2',
  ],
  street3: [
    'street3',
    'address3',
    'shippingAddress3',
    'billingAddress3',
    'partnerAddress3',
    'partnerStoreId',
  ],
  city: ['city', 'shippingCity', 'bilingCity', 'partnerCity'],
  state: ['state', 'region', 'shippingState', 'billingState', 'partnerState'],
  country: ['country', 'shippingCountry', 'billingCountry', 'partnerCountry'],
  addressAlreadyVerified: ['addressAlreadyVerified'],
  addressType: ['addressType'],
  allowPrivateShipTo: ['allowPrivateShipTo'],
  attention: [
    'attention',
    'attentionline',
    'attentionLine',
    'shippingName',
    'billingName',
  ],
  companyName: ['companyName', 'shippingCompany', 'billingCompany'],
  ext: ['ext'],
  faxNum: ['faxNum'],
  language: ['language'],
  nickNameGiven: ['nickNameGiven'],
  partnerSuite: ['partnerSuite'],
  phoneNum: [
    'phoneNum',
    'phone',
    'shippingPhone',
    'billingPhone',
    'partnerPhone',
  ],
  poBox: ['poBox'],
  poBoxPostalCode: ['poBoxPostalCode'],
  setNickName: ['setNickName'],
  suggestedAddress: ['suggestedAddress'],
  storeId: ['storeId', 'address3', 'shippingAddress3', 'billingAddress3'],
  useAsDefaultAddress: ['useAsDefaultAddress'],
  zipCode: ['zipCode', 'postalCode', 'partnerZip', 'shippingZip', 'billingZip'],
  userSelectedAddressType: ['userSelectedAddressType'],
}

/**
 * Takes an Object where the keys are the desired shape and the values are an
 * array of the possible keys that map to the desired key.
 *
 * NOTE for the most part this is stable but I'm not sure how to deal with
 * precedence of values in the array. f.e., if the source object contains two
 * keys that map to the same target key, which is preferred? And what about
 * falsy values? Probably only undefined should be ignored.
 *
 * @param  {Object} keysAndValues Object describing the desired shape and
 *                                possible inputs
 * @param  {Object} source        Object that we want to normalize
 * @return {Object}               your normalized object
 */
function normalizeFromMultipleKeys(keysAndValues, source) {
  return reduce(
    keysAndValues,
    (acc, val, resultKey) => {
      // This find function needs to be tested and its actual behavior clarified.
      const fieldName = val.find(
        (key) =>
          key in source && (typeof source[key] !== 'string' || !!source[key])
      )
      acc[resultKey] = fieldName in source ? safeTrim(source[fieldName]) : ''
      return acc
    },
    {}
  )
}

function safeTrim(value) {
  return typeof value === 'string' ? String(value).trim() : value
}

function required(desc) {
  throw Error(desc)
}
