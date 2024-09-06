export const catalog = {
  categories: [
    {
      block: false,
      description: 'This is category 1',
      draft: true,
      id: '101',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      lastEditedBy: 'Nathan',
      lastEditedDate: 'Thurs',
      master: '901',
      name: {
        en: 'Category 1'
      },
      needsAttention: false,
      order: ['201', '202', '203'],
      tags: [],
    },
    {
      block: true,
      description: 'This is category 2',
      draft: false,
      id: '102',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      lastEditedBy: 'Paul',
      lastEditedDate: 'Monday',
      master: '902',
      name: {
        en: 'Category 2'
      },
      needsAttention: true,
      order: ['204', '203', '201'],
      tags: ['401', '402'],
    },
    {
      block: true,
      description: 'This is category 3',
      draft: false,
      id: '103',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      lastEditedBy: 'Paul',
      lastEditedDate: 'Monday',
      master: '902',
      name: {
        en: 'Category 3'
      },
      needsAttention: false,
      order: ['202', '203', '204'],
      tags: ['401', '402'],
    },
    {
      block: true,
      description: 'This is category 4',
      draft: false,
      id: '104',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      lastEditedBy: 'Paul',
      lastEditedDate: 'Monday',
      master: '902',
      name: {
        en: 'Category 4'
      },
      needsAttention: false,
      order: ['204', '203', '201'],
      tags: ['401', '402'],
    },
    {
      block: true,
      description: 'This is category 5',
      draft: false,
      id: '105',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      lastEditedBy: 'Paul',
      lastEditedDate: 'Monday',
      master: '902',
      name: {
        en: 'Category 5'
      },
      needsAttention: false,
      order: ['204', '203', '201'],
      tags: ['401', '402'],
    },
  ],
  productGroups: [
    {
      block: false,
      description: 'This is product group 1',
      draft: false,
      id: '201',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      labConfig: false,
      lastEditedBy: 'Nathan',
      lastEditedDate: 'Sat',
      master: '901',
      name: {
        en: 'Product Group 1'
      },
      needsAttention: false,
      order: ['301', '302'],
      routine: false,
      tags: ['402'],
    },
    {
      block: false,
      description: 'This is product group 2',
      draft: false,
      id: '202',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      labConfig: true,
      lastEditedBy: 'Nathan',
      lastEditedDate: 'Sun',
      master: '901',
      name: {
        en: 'Product Group 2'
      },
      needsAttention: false,
      order: ['302', '303'],
      routine: false,
      tags: ['401'],
    },
    {
      block: false,
      description: 'This is product group 3',
      draft: false,
      id: '203',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      labConfig: false,
      lastEditedBy: 'Nathan',
      lastEditedDate: 'Mon',
      master: '901',
      name: {
        en: 'Product Group 3'
      },
      needsAttention: false,
      order: ['303', '304'],
      routine: false,
      tags: ['402'],
    },
    {
      block: false,
      description: 'This is product group 4',
      draft: false,
      id: '204',
      image: 'https://dairydoo.com/wp-content/uploads/2018/03/Placeholder-500x500.png',
      labConfig: false,
      lastEditedBy: 'Nathan',
      lastEditedDate: 'Tues',
      master: '902',
      name: {
        en: 'Product Group 4'
      },
      needsAttention: false,
      order: ['304', '301'],
      routine: false,
      tags: [],
    },
  ],
  tags: [
    {
      color: 'red',
      id: '401',
      name: {
        en: 'Danger'
      },
    },
    {
      color: 'green',
      id: '402',
      name: {
        en: 'Safe'
      },
    }
  ],
  userSettings: {
    pins: [
      '101', '103', '105'
    ],
    showPictures: true,
    viewMode: 'tile'
  },
  webGroupSettings: {
    defaultView: "TILE",
    taggingEnabled: true,
    languages: {
      en_US: true
    },
    defaultLanguage: "en_US",
    disableViewChange: false,
    notes: "Migrated webgroup.",
    notesLastEditedDate: 1561572208363,
    notesLastEditedBy: "vvegsana",
    welcomeText: {
      en: '<p>Custom welcome text</p>'
    },
    welcomeTextLastEditedDate: {
      en: 1561495899418
    },
    welcomeTextLastEditedBy: {
      en: "vvegsana"
    },
    header: {
      en: "860453972 New Company Standards"
    },
    configTypes: [
      "INTSERV",
      "AIUSA"
    ],
    salesArea: 1,
    webGroupName: "Marriott Intl Corporate",
    locked: false
  },
}

export const mockCartData = [
  {
    "id": "contractId",
    "name": "Open Market",
    "showBand": false,
    "lineitems": [
      {
        "type": "Product",
        "imageUrl": "https://uat1-assets.insight.com/attachments/qa2/12/68/52/126852705.jpg",
        "productUrl": "https://loginas-uat1.insight.com/en_US/buy/product/20HV0000US/LENOVO/20HV0000US/Lenovo-ThinkPad-11e---11-6----Core-i3-7100U---8-GB-RAM---128-GB-SSD/",
        "description": "Lenovo ThinkPad 11e - 11.6\" - Core i3 7100U - 8 GB RAM - 128 GB SSD",
        "materialId": "20HV0000US",
        "manufacturerId": "20HV0000US",
        "unitPrice": 883.53,
        "listPrice": 1199.99,
        "qty": 1,
        "approved": false,
        "regular": 0,
        "coiStock": 0,
        "csiStock": 0,
        "reservedStock": 0,
        "coi": false,
        "csi": false,
        "reserved": false,
        "discontinued": false,
        "shippable": true,
        "proratable": false,
        "selected": false,
      },
      {
        "type": "Product",
        "imageUrl": "https://uat1-assets.insight.com/attachments/qa2/12/57/53/125753599.jpg",
        "productUrl": "https://loginas-uat1.insight.com/en_US/buy/product/MX3-00117-SLP/MICROSOFT/MX3-00117/Microsoft-Visual-Studio-Enterprise-with-MSDN---software-assurance---1-user/",
        "description": "Microsoft Visual Studio Enterprise with MSDN - software assurance - 1 user",
        "materialId": "MX3-00117-SLP",
        "manufacturerId": "MX3-00117",
        "unitPrice": 4252.92,
        "qty": 1,
        "approved": false,
        "regular": 0,
        "coiStock": 0,
        "csiStock": 0,
        "reservedStock": 0,
        "coi": false,
        "csi": false,
        "reserved": false,
        "discontinued": false,
        "shippable": false,
        "proratable": true,
        "selected": true,
      }
    ]
  }
]

const productSet1 = {
  "attachment": "string",
  "block": false,
  "bundle": true,
  'contract': mockCartData,
  "description": {
    "en": "This is the description",
  },
  "disableQty": false,
  "draft": false,
  "groupLabConfig": "string",
  "id": "set1",
  "imageUrl": "string",
  "lastEditedBy": "Nathan",
  "lastEditedDate": "2019-07-22T18:24:47.644Z",
  "master": false,
  "name": {
    "en": "Product Set 1",
  },
  "needsAttention": false,
  "order": ["string"],
  "parents": [{}],
  "shared": false,
  "type": "MANDATORY"
}

const productSet2 = {
  "attachment": "string",
  "block": false,
  "bundle": true,
  contract: mockCartData,
  "description": {
    "en": "This is the description",
  },
  "disableQty": false,
  "draft": false,
  "groupLabConfig": "string",
  "id": "set2",
  "imageUrl": "string",
  "lastEditedBy": "Nathan",
  "lastEditedDate": "2019-07-22T18:24:47.644Z",
  "master": false,
  "name": {
    "en": "Product Set 2",
  },
  "needsAttention": false,
  "order": ["string"],
  "parents": [{}],
  "shared": false,
  "type": "MULTIPLE"
}

const productSet3 = {
  "attachment": "string",
  "block": false,
  "bundle": true,
  contract: mockCartData,
  "description": {
    "en": "This is the description",
  },
  "disableQty": false,
  "draft": false,
  "groupLabConfig": "string",
  "id": "set3",
  "imageUrl": "string",
  "lastEditedBy": "Nathan",
  "lastEditedDate": "2019-07-22T18:24:47.644Z",
  "master": false,
  "name": {
    "en": "Product Set 3",
  },
  "needsAttention": false,
  "order": ["string"],
  "parents": [{}],
  "shared": false,
  "type": "SINGLE"
}

export const productSets = [productSet1, productSet2, productSet3]

export const cartResponse = {
  items: [
    {
      "imageUrl": "https://uat1-assets.insight.com/attachments/qa2/12/68/52/126852705.jpg",
      "description": "Lenovo ThinkPad 11e - 11.6\" - Core i3 7100U - 8 GB RAM - 128 GB SSD",
      "materialId": "20HV0000US",
      "manufacturerId": "20HV0000US",
      "unitPrice": 883.53,
      "qty": 2,
    },
    {
      "imageUrl": "https://uat1-assets.insight.com/attachments/qa2/12/57/53/125753599.jpg",
      "description": "Microsoft Visual Studio Enterprise with MSDN - software assurance - 1 user",
      "materialId": "MX3-00117-SLP",
      "manufacturerId": "MX3-00117",
      "unitPrice": 4252.92,
      "qty": 1,
    }
  ],
  subtotal: 6019.98
}

export const enhancedLineItem = {
  "type": "Product",
  "imageUrl": "https://uat1-assets.insight.com/attachments/qa2/12/57/53/125753599.jpg",
  "manufacturerImage": '',
  "productUrl": "https://loginas-uat1.insight.com/en_US/buy/product/MX3-00117-SLP/MICROSOFT/MX3-00117/Microsoft-Visual-Studio-Enterprise-with-MSDN---software-assurance---1-user/",
  "description": "Microsoft Visual Studio Enterprise with MSDN - software assurance - 1 user",
  "materialId": "MX3-00117-SLP",
  "manufacturerId": "MX3-00117",
  "unitPrice": 4252.92,
  "qty": 1,
  "approved": false,
  "regular": 0,
  "coiStock": 0,
  "csiStock": 0,
  "reservedStock": 0,
  "coi": false,
  "csi": false,
  "reserved": false,
  "discontinued": false,
  "shippable": false,
  "proratable": true,
  "selected": true,
  "overview": "This is the overview.",
  "specifications": [
    {
      label: 'Section 1',
      value: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
        { label: "D", value: "d" },
      ]
    },
    {
      label: 'Section 2',
      value: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
        { label: "D", value: "d" },
      ]
    },

    {
      label: 'Section 3',
      value: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
        { label: "D", value: "d" },
      ]
    },
  ]
}
