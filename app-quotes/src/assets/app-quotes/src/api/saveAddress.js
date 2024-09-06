import axios, { POST } from './axiosConfig'

export function createAddress(address) {
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

  return axios({
    method: POST,
    url: `insightweb/transaction/submitContactAddress`,
    data: { ...defaultBody, ...address },
  })
    .then(({ data }) => data)
    .catch((err) => {
      if (err.response?.data?.message) {
        err = new Error(err.response.data.message)
      }
      console.warn(`There was a problem adding the address`, err)
      throw err
    })
}

export function saveShippingAddressToShoppingRequest(shippingData) {
  return axios({
    method: 'post',
    url: 'insightweb/shipping',
    data: shippingData,
  })
    .then((response) => response)
    .catch((error) => {
      console.warn(`There was a problem saving the address`, error)
      throw error
    })
}

export default createAddress
