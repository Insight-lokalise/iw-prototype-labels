import axios, {GET} from './axiosConfig'

export function savePersonalInfo({ firstName, lastName, phoneNumber, email }) {
  return axios({
    method: 'post',
    url: `/endUser/updateUserPersonalInfo`,
    data: { firstName, lastName, email, phoneNumber},
  }).catch(error => {
    console.warn(`Failed to save personal information`, error)
    throw error
  })
}

export function savePreferences({ emailFormat, orderQuotes, emailQuotes }) {
  return axios({
    method: 'post',
    url: `/endUser/updateUserPreferences`,
    data: { emailFormat, emailOrders: orderQuotes, emailQuotes},
  }).catch(error => {
    console.warn(`Failed to save personal information`, error)
    throw error
  })
}

export function updateUserName(userName){
  return axios({
    method: 'post',
    url: `/endUser/updateUsername`,
    data: userName,
    headers:{'Content-Type': 'text/plain'},
    responseType: 'text'
  }).then(({data})=>({ userName: data, password: '*********' })).catch(error => {
     console.warn(`Failed to update user name`, error)
     throw error
  })
}

export function updatePassword(passwordObj){
  return axios({
    method: 'post',
    url: `/endUser/updatePassword`,
    data: passwordObj,
    headers:{'Content-Type': 'application/json'}
  }).catch(error => {
    console.warn(`Failed to update password`, error)
    throw error
  })
}

export function createAddress(address){
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
    method: 'post',
    url: `/transaction/submitContactAddress`,
    data: Object.assign({}, defaultBody, address),
  }).then(({data}) =>data).catch(error => {
    console.warn(`There was a problem adding the address`, error)
    throw error
  })
}

export function updateAddress(address, shipTo, defaultShipTo){
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
    method: 'post',
    url: `/transaction/editContactAddress/${shipTo}/${defaultShipTo}`,
    data: Object.assign({}, defaultBody, address),
  }).then(({data}) =>data).catch(error => {
    console.warn(`There was a problem adding the address`, error)
    throw error
  })
}

export function updateDefaultAddress({ isShipping, isSoldTo, shipTo }){
  return axios({
    method: 'post',
    url: `transaction/setDefaultAddressAddress`,
    data: { 
      shipBillIndicator: isShipping ? 1 : 2, /** 1=shipping, 2=billing * */
      changeDefault: {
        defaultShipto: shipTo,
        linkList: [],
        deLinkList: [],        
        defaultfavoriteId: 0,
        defaultfavoriteLineId: 0,
        soldTo: isSoldTo,
      }
    },
    headers:{'Content-Type': 'application/json'}
  }).catch(error => {
    console.warn(`Failed to update default address`, error)
    throw error
  })
}

export function updateDefaultPaymentMethod(paymentMethod) {
  return axios({
    method: 'post',
    url: '/payment/default',
    data: paymentMethod,
    headers:{'Content-Type': 'application/json'}
  }).catch(error => {
    console.warn(`Failed to update default payment method`, error)
    throw error
  })
}

export function updateDefaultCard({cardId, isCreditCard}) {
  const timestamp = new Date().getTime();
  const cardType = isCreditCard ? 2 : 3
  return axios({
    method: 'get',
    url: `/card/default/${cardId}/${cardType}?_=${timestamp}`,
  }).catch(error => {
    console.warn(`Failed to update default card`, error)
    throw error
  })
}

export function deleteAddress({ isShipping, shipTo }){
  return axios({
    method: 'post',
    url: isShipping ? '/selectiveUpdateShippingAddress' : '/selectiveUpdateBillingAddressForUser',
    data: { 
      linkList: [], 
      deLinkList: [shipTo], 
      defaultShipto: 0, 
      defaultfavoriteId: 0, 
      defaultfavoriteLineId: 0 
    },
    headers:{'Content-Type': 'application/json'}
  }).catch(error => {
    console.warn(`There was a problem deleting the address`, error)
    throw error
  })
}

export function deleteStoredCard(cardId) {
  const timestamp = new Date().getTime()
  return axios({
    method: 'get',
    url: `/transaction/deleteStoredCards/${cardId}?_=${timestamp}`
  }).catch(error => {
    console.warn(`Failed to delete card`, error)
    throw error
  })
}

export function createStoredCard({
  paymentMethodType,
  cardDesc,
  displayCardNum,
  isDefaultCard,
  CardExpMonth,
  CardExpYear,
  CardHolderName,
  CardToken,
  CardType
}){
  const timestamp = new Date().getTime()

  return axios({
    method: 'post',
    url: '/transaction/saveStoredCards',
    data: {
      lpWebLoginProfileId:0,
      isDefaultCard,
      storedCardPoNum:null,
      createdOn:timestamp,
      updatedOn:timestamp,
      displayCardNum,
      storedCardDetailsChanged:false,
      storedCardId:0,
      storedCardDesc:cardDesc || '-',
      storedCardType:CardType,
      storedCardToken:CardToken,
      storedCardExpMonth:CardExpMonth,
      storedCardExpYear:CardExpYear,
      storedCardHolderName:CardHolderName,
      storedCardMethodId:paymentMethodType
    },
    headers:{'Content-Type': 'application/json'}
  }).catch(error => {
    console.warn(`Failed to delete address`, error)
    throw error
  })
}


export function saveStoredCard(card){
  const timestamp = new Date().getTime()
  return axios({
    method: 'post',
    url: '/transaction/saveStoredCards',
    data: {...card, updatedOn: timestamp},
    headers:{'Content-Type': 'application/json'}
  }).catch(error => {
    console.warn(`Failed to save saved card`, error)
    throw error
  })
}

export function updateDefaultAccount(soldTo) {
  const timestamp = new Date().getTime();
  return axios({
    method: 'get',
    url: `/endUser/updateDefaultSoldto/${timestamp}/${soldTo}`,
  }).catch(error => {
    console.warn(`Failed to update default account`, error)
    throw error
  })
}
