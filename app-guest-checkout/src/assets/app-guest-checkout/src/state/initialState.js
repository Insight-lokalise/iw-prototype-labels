export default {
  initialShoppingRequest: {
    "webReferenceNumber":0,
    "rp":0,
    "cart":{
      "summary":{
        "ewrFee":0,
        "taxCost":0,
        "subTotal":0,
        "totalCost":0,
        "pstTaxCost":0,
        "shippingCost":0,
        "gstHstTaxCost":0
      },
      "cartItems":[

      ]
    },
    "documentType":"Order",
    "soldTo":{
      "id":11280161,
      "currency":"USD",
      "salesAreaId":1
    },
    "user":{
      "name":"",
      "email":"",
      "loginType":10,
      "loginProfileId":0,
      "requestorGroupId":0,
      "userSessionType":"GUEST"
    },
    "locale":"en_US",
    "webGroupId":0,
    "createdOn":"2023-07-06T15:14:52.806+00:00",
    "salesDocumentNumber":0,
    "consortiaId":0
  },
  shoppingRequest: {},
  items: [
    {
      bundle: true,
      id: 0,
      quantity: 0,
    },
  ],
  materialList: [
    {
      accessories: true,
      configured: true,
      contractId: '',
      enforceEnrollment: true,
      enrollentId: '',
      materialId: '',
      parentId: 0,
      quantity: 0,
      warranties: true,
      warrantyMaterialId: '',
      warrantyQuantity: 0,
    },
  ],
  flags: {},
  customerInformation: {
    cart: {},
    consortiaId: 0,
    createdBy: '',
    createdByEmail: '',
    createdOn: '',
    documentType: '',
    locale: '',
    orderMetaData: {},
    rp: 0,
    salesDocumentNumber: 0,
    soldTo: {
      id: 0,
      currency: 'USD',
      salesAreaId: 0,
    },
    updatedBy: '',
    user: {
      name: '',
      email: '',
      loginProfileId: null,
      loginType: null,
      requestorGroupId: null,
      userSessionType: '',
    },
    webGroupId: null,
    webReferenceNumber: 0,
  },
  lineLevelSessionInfos: [],
  invalidIds: [],
  userData: null,
  address: {
    address1: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    zipCode: '',
    zipExt: '',
    countryId: '',
    region: '',
    county: '',
    poBox: '',
    poBoxZipCode: '',
  },
  shipping:{
    "id": 0,
    "notes": "",
    "phone": "",
    "address": {
        "address1": "",
        "address2": "",
        "address3": "",
        "city": "",
        "state": "",
        "zipCode": "",
        "zipExt": "",
        "countryId": "",
        "region": "",
        "county": "",
        "poBox": "",
        "poBoxZipCode": ""
    },
    "carrier": {
        "name": "",
        "option": "",
        "saturday": false,
        "description": "",
        "vasOptions": [
            ""
        ],
        "thirdPartyAccountNumber": "",
        "thirdPartyDisplayName": ""
    },
    "favoriteName": "",
    "attentionLine": "",
    "shipComplete": false,
    "companyName": "",
    "overrideAddress": false,
    "additionalShippingNotificationEmail": ""
},
  billing: {
    "id": 0,
    "phone": "",
    "address": {
      "address1": "",
      "address2": "",
      "address3": "",
      "city": "",
      "state": "",
      "zipCode": "",
      "zipExt": "",
      "countryId": "",
      "region": "",
      "county": "",
      "poBox": "",
      "poBoxZipCode": ""
    },
    "payment": {
      "type": "",
      "option": "",
      "cardInfo": {
        "id": 0,
        "type": "",
        "token": "",
        "worldPayToken": "",
        "expiryYear": 0,
        "expiryMonth": 0,
        "nameOnCard": "",
        "description": "",
        "maskedCardNumber": "",
        "saveForFutureUse": false
      },
      "poNumber": "",
      "poReleaseNumber": "",
      "procurementFields": []
    },
    "favoriteName": "",
    "attentionLine": "",
    "companyName": "",
    "overrideAddress": false
  }
}
