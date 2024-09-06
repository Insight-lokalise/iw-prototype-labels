// This is a temporary file to provide data for rendering purposes
// Sample Products
const product1 = {
  "type":"Product",
  "imageUrl": {
    "largeImage":"https://prod-assets.insight.com/ccms_img/noImageAvailable_150x112.png",
    "smallImage":"https://prod-assets.insight.com/ccms_img/noImageAvailable_50x37.png",
    "manufacturerSmallImage":"https://uat1-assets.insight.com/attachments/qa2/07/77/45/07774514.jpg",
    "manufacturerLargeImage":"https://uat1-assets.insight.com/attachments/qa2/07/77/45/07774513.jpg"
  },
  "productUrl":"https://uat1.insight.com/en_US/buy/product/99-PLATINUM-100/INSIGHT/99-PLATINUM-100/LAB-CONFIG--PLATINUM/",
  "description":"LAB CONFIG/ PLATINUM",
  "materialId":"99-PLATINUM-100",
  "manufacturerId":"99-PLATINUM-100",
  "unitPrice":25.82,
  "qty":1,
  "approved":false,
  "regular":0,
  "coi":0,
  "csi":0,
  "reserved":0,
  "discontinued":false,
  "diversityPartner":"eVA Eprocurement",
  "smarttrackers": [
    {"name":"required field 1","value":"LL3"}
  ],
  "reportingFields": [
    {"name":"REQUIRED 4","value":"RF4"},
    {"name":"REQUIRED 5","value":"RF5"}
  ]
}
const product2 = {
  "type":"Product",
  "imageUrl": {
    "largeImage":"https://uat1-assets.insight.com/attachments/qa2/72/07/84/72078403.jpg",
    "smallImage":"https://uat1-assets.insight.com/attachments/qa2/72/07/84/72078402.jpg",
    "manufacturerSmallImage":"https://uat1-assets.insight.com/attachments/qa2/39/82/18/39821816.jpg",
    "manufacturerLargeImage":"https://uat1-assets.insight.com/attachments/qa2/39/82/18/39821817.jpg"
  },
  "productUrl":"https://uat1.insight.com/en_US/buy/product/OCN1/TARGUS/OCN1/Targus-Notepac-notebook-carrying-case/",
  "description":"Targus Notepac notebook carrying case",
  "materialId":"OCN1",
  "manufacturerId":"OCN1",
  "unitPrice":29.94,
  "qty":1,
  "approved":false,
  "regular":1725,
  "coi":0,
  "csi":0,
  "reserved":0,
  "discontinued":false,
  "diversityPartner":"eVA Eprocurement",
  "smarttrackers": [
    {"name":"required field 1","value":"LL3"}
  ],
  "reportingFields": [
    {"name":"REQUIRED 4","value":"RF4"},
    {"name":"REQUIRED 5","value":"RF5"}
  ]
}

const product3 = {
  "type":"Product",
  "imageUrl": {
    "largeImage":"https://uat1-assets.insight.com/attachments/qa2/12/61/85/126185571.jpg",
    "smallImage":"https://uat1-assets.insight.com/attachments/qa2/12/61/85/126185569.jpg",
    "manufacturerSmallImage":"https://uat1-assets.insight.com/attachments/qa2/91/86/82/91868253.png",
    "manufacturerLargeImage":"https://uat1-assets.insight.com/attachments/qa2/91/86/82/91868252.png"
  },
  "productUrl":"https://uat1.insight.com/en_US/buy/product/57Y4393/LENOVO/57Y4393/Lenovo---video-converter---black/",
  "description":"Lenovo - video converter - black",
  "materialId":"57Y4393",
  "manufacturerId":"57Y4393",
  "unitPrice":32.61,
  "qty":1,
  "approved":false,
  "regular":2081,
  "coi":0,
  "csi":0,
  "reserved":0,
  "discontinued":false,
  "diversityPartner":"eVA Eprocurement",
  "smarttrackers": [
    {"name":"required field 1","value":"LL3"}
  ],
  "reportingFields": [
    {"name":"REQUIRED 4","value":"RF4"},
    {"name":"REQUIRED 5","value":"RF5"}
  ]
}

const product4 = {
  "type":"Product",
  "imageUrl": {
    "largeImage":"https://uat1-assets.insight.com/attachments/qa2/12/89/49/128949839.jpg",
    "smallImage":"https://uat1-assets.insight.com/attachments/qa2/12/89/49/128949838.jpg"
  },
  "productUrl":"https://uat1.insight.com/en_US/buy/product/L9K20UT#ABA/HP INC/L9K20UT#ABA/HP-Workstation-Z240---MT---Core-i7-6700-3-4-GHz---16-GB---256-GB---US/",
  "description":"HP Workstation Z240 - MT - Core i7 6700 3.4 GHz - 16 GB - 256 GB - US",
  "materialId":"L9K20UT#ABA",
  "manufacturerId":"L9K20UT#ABA",
  "unitPrice":1289.86,
  "qty":1,
  "approved":false,
  "regular":355,
  "coi":0,
  "csi":0,
  "reserved":0,
  "discontinued":true,
  "diversityPartner":"NC E Procurement",
  "smarttrackers": [
    {"name":"required field 1","value":"LL4"}
  ],
  "reportingFields": [
    {"name":"REQUIRED 4","value":"RF6"},
    {"name":"REQUIRED 5","value":"RF7"}
  ]
}

const product5 = {
  "type":"Product",
  "imageUrl": {
    "largeImage":"https://uat1-assets.insight.com/attachments/qa2/12/88/93/128893916.jpg",
    "smallImage":"https://uat1-assets.insight.com/attachments/qa2/12/88/93/128893914.jpg"
  },
  "productUrl":"https://uat1.insight.com/en_US/buy/product/L9K19UT#ABA/HP INC/L9K19UT#ABA/HP-Workstation-Z240---MT---Core-i7-6700-3-4-GHz---8-GB---1-TB/",
  "description":"HP Workstation Z240 - MT - Core i7 6700 3.4 GHz - 8 GB - 1 TB",
  "materialId":"L9K19UT#ABA",
  "manufacturerId":"L9K19UT#ABA",
  "unitPrice":1171.32,
  "qty":1,
  "approved":false,
  "regular":364,
  "coi":0,
  "csi":0,
  "reserved":0,
  "discontinued":true,
  "diversityPartner":"Vision Business Products Inc",
  "smarttrackers": [
    {"name":"required field 1","value":"LL3"}
  ]
}

// Only Open Market with simple product
const cart1 = {
  "contracts": [
    {
      "name":"OpenMarket",
      "showBand":false,
      "lineItems": [ product1 ]
    }
  ]
}

// Only Open Market with bundle and simple product
const cart2 = {
  "contracts": [
    {
      "name":"OpenMarket",
      "showBand":false,
      "lineItems":[
        product1,
        {
          "type":"Bundle", "name":"","lineItems": [ product1, product2 ]
        }
      ]
    }
  ]
}

// Open Market, Contract with bundle and simple product
const cart3 = {
  "contracts": [
    {
      "name":"OpenMarket",
      "showBand":false,
      "lineItems": [
        product1,
        {
          "type":"Bundle",
          "name":"",
          "lineItems": [ product1, product2 ]
        }
      ]
    },
    {
      "name":"US Communities",
      "showBand":true,
      "lineItems": [
        product1,
        {
          "type":"Bundle",
          "name":"",
          "lineItems": [ product1, product2 ]
        }
      ]
    }
  ]
}


// Saved Templates

// Open Market, Contract with bundle and simple product
const order1 = {
  "contracts": [
    {
      "name": "U.S. COMMUNITIES IT PRODUCTS & SERVICES",
      "showBand": true,
      "lineitems": [ product1 ]
    },
    {
      "name": "U.S. COMMUNITIES IT PRODUCTS & SERVICES",
      "showBand": true,
      "lineitems": [ product2 ]
    }
  ],
  "shipping": {
    "id": 21211442,
    "address": {
      "address1": "123 Ship St.",
      "address2": null,
      "address3": null,
      "city": "Blue",
      "state": "TX",
      "zipCode": 12345,
      "zipExt": "",
      "countryId": null,
      "region": "",
      "county": "",
      "poBox": "",
      "poBoxZipCode": ""
    },
    "shipComplete": false,
    "overrideAddress": false
  },
  "billing": {
    "id": 21211442,
    "address": {
      "address1": "123 Bill St.",
      "address2": null,
      "address3": null,
      "city": "Orange",
      "state": "TX",
      "zipCode": 54321,
      "zipExt": "",
      "countryId": null,
      "region": "",
      "county": "",
      "poBox": "",
      "poBoxZipCode": ""
    },
    "shipComplete": false,
    "overrideAddress": false
  },
  "freightInfo": {
    "carrier": {
      "name": "SLS",
      "option": "50",
      "saturday": false
    }
  },
  "payment": {
    "poNumber":"",
    "poReleaseNumber":"",
    "maskedCard":"",
    "expiryMonth":"",
    "expiryYear":"",
    "nameOnCard":""
  },
  "smarttrackers": [
    { "name": "My List", "value": "" },
    { "name": "ChandraHeaderLevel1", "value": "test" },
    { "name": "ChandraHeaderLevel2", "value": "test" },
    { "name": "ChandraHeaderLevel3", "value": "" }
  ]
}

const order2 = {
  "contracts": [
    {
      "id":"1510000945",
      "name":"U.S. COMMUNITIES IT PRODUCTS & SERVICES",
      "showBand":true,
      "lineitems": [
        {
          "type":"Bundle",
          "name":"Configs test - DNR",
          "lineitems": [ product1, product2, product3 ],
          "discontinued":false
        },
        product4,
      ]
    },
    {
      "id":"1510000943",
      "name":"U.S. COMMUNITIES IT PRODUCTS & SERVICES",
      "showBand":true,
      "lineitems": [ product5 ]
    },
    {
      "id":"1510000584","name":"STATE OF MINNESOTA - COMPUTER HARDWARE, SOFTWARE & SERVICES",
      "showBand":true,
      "lineitems": [ product5 ]
    }
  ],
  "shipping": {
    "id":21211442,
    "phone":"",
    "address": {
      "address1":"2701 MISSION ST",
      "address2":"",
      "address3":"",
      "city":"SAN FRANCISCO",
      "state":"CA",
      "zipCode":"94110-3103",
      "zipExt":"",
      "countryId":"US",
      "region":"",
      "county":"",
      "poBox":"",
      "poBoxZipCode":""
    },
    "favoriteName":"",
    "attentionLine":"",
    "shipComplete":true,
    "companyName":"chandra",
    "overrideAddress":true
  },
  "freightInfo": {
    "carrier": {
      "name":"SLS",
      "option":"05",
      "saturday":false,
      "description":"Next Day AM"
    },
    "notificationEmail": [
      "IPSUSER@MAILINATOR.COM",
      "ipstest1@gmail.com",
      "ipstest2@yahoo.com"
    ]
  },
  "billing": {
    "id":10384786,
    "phone":"800-321-2437",
    "address": {
      "address1":"2701 E. INSIGHT WAY",
      "address2":"",
      "address3":"",
      "city":"CHANDLER",
      "state":"AZ",
      "zipCode":"85286",
      "zipExt":"",
      "countryId":"US",
      "region":"",
      "county":"",
      "poBox":"",
      "poBoxZipCode":""
    },
    "favoriteName":"",
    "attentionLine":"",
    "companyName":"Validation Acccount for IPS",
    "overrideAddress":true
  },
  "payment": {
    "type":"2",
    "option":"2040",
    "cardInfo": {
      "id":0,
      "type":"AMEX",
      "token":"-E803-0005-HYPEN000000004",
      "expiryYear":2022,
      "expiryMonth":5,
      "nameOnCard":"Chandra Tenneti",
      "maskedCardNumber":"************0005"
    },
    "poNumber":"234566",
    "procurementFields":[]
  },
  "smarttrackers": [
    {"name":"My List","value":""},
    {"name":"ChandraHeaderLevel1","value":"HL1"},
    {"name":"ChandraHeaderLevel2","value":"HL2"},
    {"name":"ChandraHeaderLevel3","value":""}
  ]
}

export const carts = {
  cart1,
  cart2,
  cart3,
  order1,
  order2,
}

export const list = [
  { id: 'cart1', name: 'Cart 1', date: 'Date 1', type: 'cart' },
  { id: 'cart2', name: 'Cart 2', date: 'Date 2', type: 'cart' },
  { id: 'cart3', name: 'Cart 3', date: 'Date 3', type: 'cart' },
  { id: 'order1', name: 'Order 1', date: 'Date 4', type: 'template' },
  { id: 'order2', name: 'Order 2', date: 'Date 5', type: 'template' }
]
