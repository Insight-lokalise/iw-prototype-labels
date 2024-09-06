import { t } from '@insight/toolkit-utils/lib/labels'
export const PAGE_ROUTE = {
  CART: '/cart',
  CUSTOMER_INFO: '/customerInfo',
  ITEM_INFO: '/lineLevelInfo',
  SHOPPING_INFO: '/shipBill',
  REVIEW: '/review',
  RECEIPT: '/receipt',
  PROCESS: '/process',
}

export const nextStepMap = {
  'HEADER_LEVEL': '/lineLevelInfo#order-info',
  'LINE_LEVEL': '/lineLevelInfo#item-info',
  'SHIPPING': '/shipBill',
  'CARRIER': '/shipBill#shipping-options',
  'BILLING': '/shipBill#billing-address',
  'PAYMENT': '/review',
  'REVIEW': '/review',
}

export const CARD_SCREEN_INFO = 'checkoutCardScreening'

export const GUEST_PAYMENT_METHODS = [{
  webLoginProfileId: 0,
  paymentMethodId: 2,
  webGroupId: 0,
  isDefault: true,
  description: null,
  paymentOptionTerms: "2040"
}, {
  webLoginProfileId: 0,
  paymentMethodId: 3,
  webGroupId: 0,
  isDefault: false,
  description: null,
  paymentOptionTerms: "2040"
}]

export const ROUTES = {
  CART: {
    url: PAGE_ROUTE.CART,
    name: 'Cart',
  },
  CUSTOMER_INFO: {
    url: PAGE_ROUTE.CUSTOMER_INFO,
    name: 'Customer information',
  },
  ITEM_INFO: {
    url: PAGE_ROUTE.ITEM_INFO,
    name: 'Order & item information',
  },
  SHOPPING_INFO: {
    url: PAGE_ROUTE.SHOPPING_INFO,
    name: 'Shipping & billing',
  },
  REVIEW: {
    url: PAGE_ROUTE.REVIEW,
    name: 'Review order',
  },
  RECEIPT: {
    url: PAGE_ROUTE.RECEIPT,
    name: 'Order confirmation',
  },
  PROCESS: {
    url: PAGE_ROUTE.PROCESS,
    name: 'Process order',
  },
}

export const stepperIndexMap = {
  [ROUTES.CUSTOMER_INFO.url]: 0,
  [ROUTES.ITEM_INFO.url]: 1,
  [ROUTES.SHOPPING_INFO.url]: 2,
  [ROUTES.REVIEW.url]: 3,
  [ROUTES.RECEIPT.url]: 4,
  [ROUTES.PROCESS.url]: 3,
}

/* Placement Ids */
export const RECOMMENDATIONS_PLACEMENT_IDS = {
  rr_warranties: 'cart_page.rr_warranties',
  rr_warranties_qa: 'cart_page.rr_warranties_qa',
  rr_accessories: 'cart_page.rr_accessories'
}

export const US_PHONE_NUMBER_PATTERN = '[0-9]{3}-[0-9]{3}-[0-9]{4}'

export const displayNameMap = {
  PCN_NO: 'PCN #',
  LICENSE: 'License #',
  INITIAL_STK_NO: 'Initial stock #',
}

export const items = [
  {
    cartItemMetaData: {
      contractReportingField: [null],
      countryOfUsage: '',
      diversityPartnerId: null,
      sellRequirement: [],
    },
    imageURL:
      'https://cdn.cs.1worldsync.com/3f/07/3f07591f-9ad2-44ff-8b34-021be373ea73.jpg',
    pdpURL: '/en_US/buy/product/61F1GAR2US/LENOVO/61F1GAR2US/_/',
    materialInfo: {
      active: true,
      customDescription: null,
      description: 'LENOVO THINKVISION T32H-20 - LED MONITOR - 3',
      manufacturerPartNumber: '345',
      materialId: '345',
      nonShipabble: false,
      unitPrice: 514.78,
      ewrFee: null,
    },
    quantity: 1.0,
    sapLineItemNumber: '10',
    serialNumberAssetTagList: null,
    availability: {
      totalQuantity: 47,
      unlimited: false,
      availabilityMessage: 'inStock',
    },
  },
  {
    cartItemMetaData: {
      contractReportingField: [null],
      countryOfUsage: 'US',
      diversityPartnerId: null,
      sellRequirementId: 'EU',
      suppressSellReq: false,
      sellRequirement: [
        {
          value: null,
          name: 'CUSTOMER_QUOTE_NO',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_2',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_3',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_4',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: '',
          name: 'LICENSE',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'DEAL_REG_ID',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: 'newuserces@mailinator.com',
          name: 'CONTACT_EMAIL',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: 'NewUser3testsdf CESlongsdfsd',
          name: 'CONTACT_NAME',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: '4805555555',
          name: 'CONTACT_PHONE',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: '',
          name: 'PCN_NO',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'AUTHORIZATION',
          required: false,
          defaultValue: false,
          editable: true,
        },
      ],
    },
    imageURL:
      'https://cdn.cs.1worldsync.com/60/6e/606e52ff-de0b-49bd-abaa-41c088311da0.jpg',
    pdpURL: '/en_US/buy/product/ARMWALL/STARTECH.COM/ARMWALL/_/',
    materialInfo: {
      active: true,
      customDescription: null,
      description:
        'STARTECH.COM MONITOR WALL MOUNT - FIXED - SUPPORTS MONITORS13" TO 34" - VESA MONITOR WALL MOUNT BRACKET - ALUMINUM - BLACK & SILVER (ARMWALL) - WALL MOUNT   ',
      manufacturerPartNumber: 'ARMWALL',
      materialId: '123',
      nonShipabble: false,
      unitPrice: 23.29,
      ewrFee: null,
    },
    quantity: 2.0,
    sapLineItemNumber: '20',
    serialNumberAssetTagList: null,
    availability: {
      totalQuantity: 665,
      unlimited: false,
      availabilityMessage: 'inStock',
    },
  },
]

export const splitItems = [
  {
    cartItemMetaData: {
      contractReportingField: [null],
      countryOfUsage: 'US',
      diversityPartnerId: null,
      sellRequirement: [
        {
          value: null,
          name: 'CUSTOMER_QUOTE_NO',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_2',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_3',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_4',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: '',
          name: 'LICENSE',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'DEAL_REG_ID',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: 'newuserces@mailinator.com',
          name: 'CONTACT_EMAIL',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: 'NewUser3testsdf CESlongsdfsd',
          name: 'CONTACT_NAME',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: '4805555555',
          name: 'CONTACT_PHONE',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: '',
          name: 'PCN_NO',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'AUTHORIZATION',
          required: false,
          defaultValue: false,
          editable: true,
        },
      ],
    },
    imageURL:
      'https://cdn.cs.1worldsync.com/3f/07/3f07591f-9ad2-44ff-8b34-021be373ea73.jpg',
    pdpURL: '/en_US/buy/product/61F1GAR2US/LENOVO/61F1GAR2US/_/',
    materialInfo: {
      active: true,
      customDescription: null,
      description: 'LENOVO THINKVISION T32H-20 - LED MONITOR - 3',
      manufacturerPartNumber: '61F1GAR2US',
      materialId: '61F1GAR2US',
      nonShipabble: false,
      unitPrice: 514.78,
      ewrFee: null,
    },
    quantity: 1.0,
    sapLineItemNumber: '10',
    serialNumberAssetTagList: null,
    availability: {
      totalQuantity: 47,
      unlimited: false,
      availabilityMessage: 'inStock',
    },
  },
  {
    cartItemMetaData: {
      contractReportingField: [null],
      countryOfUsage: 'US',
      diversityPartnerId: null,
      sellRequirementId: 'EU',
      suppressSellReq: false,
      sellRequirement: [
        {
          value: null,
          name: 'CUSTOMER_QUOTE_NO',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_2',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_3',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'CONTACT_EMAIL_4',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: '',
          name: 'LICENSE',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'DEAL_REG_ID',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: 'newuserces@mailinator.com',
          name: 'CONTACT_EMAIL',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: 'NewUser3testsdf CESlongsdfsd',
          name: 'CONTACT_NAME',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: '4805555555',
          name: 'CONTACT_PHONE',
          required: true,
          defaultValue: true,
          editable: true,
        },
        {
          value: '',
          name: 'PCN_NO',
          required: false,
          defaultValue: false,
          editable: true,
        },
        {
          value: null,
          name: 'AUTHORIZATION',
          required: false,
          defaultValue: false,
          editable: true,
        },
      ],
    },
    imageURL:
      'https://cdn.cs.1worldsync.com/60/6e/606e52ff-de0b-49bd-abaa-41c088311da0.jpg',
    pdpURL: '/en_US/buy/product/ARMWALL/STARTECH.COM/ARMWALL/_/',
    materialInfo: {
      active: true,
      customDescription: null,
      description:
        'STARTECH.COM MONITOR WALL MOUNT - FIXED - SUPPORTS MONITORS13" TO 34" - VESA MONITOR WALL MOUNT BRACKET - ALUMINUM - BLACK & SILVER (ARMWALL) - WALL MOUNT   ',
      manufacturerPartNumber: 'ARMWALL',
      materialId: '567',
      nonShipabble: false,
      unitPrice: 23.29,
      ewrFee: null,
    },
    quantity: 1.0,
    sapLineItemNumber: '20',
    serialNumberAssetTagList: null,
    availability: {
      totalQuantity: 665,
      unlimited: false,
      availabilityMessage: 'inStock',
    },
  },
]

export const USER_PERMISSIONS = {
  ENABLE_QUICK_CHECKOUT: 'enable_quick_checkout',
}

export const exampleExternalWarranties = [
  {
    materialId: 'PBOT250AVRAD12D',
    cnetProductId: 'S22681667',
    descriptions: {
      shortDescription:
        'Safeware Protection Plan with Accidental Damage from Handling - extended service agreement - 1 year - depot',
      longDescription:
        'Safeware Protection Plan with Accidental Damage from Handling - Extended service agreement - parts and labor - 1 year - depot - must be purchased within 90 days of the product purchase - $200-$249.99',
      customerDescription: null,
    },
    maturityStatus: 'SELLABLE',
    category: null,
    manufacturer: {
      id: '0007082255',
      name: 'SAFEWARE THE INSURANCE AGENCY INC',
      url: 'www.safeware.com',
      partNumber: 'PBOT250AVRAD12D',
      images: {
        smallImage:
          'https://cdn.cs.1worldsync.com/de/50/de50cf42-e25c-4d1c-9b21-9c85a3cabd2a.jpg',
        largeImage:
          'https://cdn.cs.1worldsync.com/7a/10/7a108859-5901-4ef3-a3f5-2a479b04f7a8.jpg',
      },
    },
    price: {
      productPrices: [
        {
          price: 13.23,
          currency: 'USD',
          priceLabel: 'yourPrice',
        },
        {
          price: 18.99,
          currency: 'USD',
          priceLabel: 'listPrice',
        },
      ],
      contractPrices: [],
      listAndCustomerPrice: true,
      callForPrice: false,
      leasePrice: null,
      assortmentId: null,
      referenceAssortmentId: null,
      contractId: null,
      softwareContractId: null,
    },
    availability: {
      totalQuantity: 0,
      unlimited: true,
      specialMessage: null,
      availabilityMessage: 'unlimited',
      plantsStock: {},
    },
    extendedSpecs: {},
    images: {
      smallImage:
        'https://cdn.cs.1worldsync.com/8a/6b/8a6b756c-0e8d-4750-bc1c-4ed0b770352b.jpg',
      largeImage:
        'https://cdn.cs.1worldsync.com/61/5b/615b8eee-b4ed-42f5-b72f-43583ed3c21d.jpg',
    },
    productFields: {
      plant: '10',
      customerPlant: null,
      group: 'ZF',
      type: 'ZPOS',
      showOnWeb: 'true',
      buyButton: 'true',
      showPrice: 'true',
      softwareDelivery: null,
      countryOfOrigin: null,
      taaComplaint: null,
      softwareLicenseType: null,
      softwareProgramId: null,
      durationInMonths: null,
      marketingText: null,
      itemCategoryGroup: 'ZWRN',
      generalItemCategory: 'ZWRN',
    },
    bullets: {
      bullet1: 'Type: Extended service agreement',
      bullet2: 'Service Included: Parts and labor',
      bullet3: 'Location: Depot',
      bullet4: 'Full Contract Period: 1 Year',
    },
    containedProducts: [],
    discontinued: false,
    approved: false,
    standard: false,
    unspscCode: null,
  },
  {
    materialId: 'PBOT250AVRESP24D',
    cnetProductId: 'S22681669',
    descriptions: {
      shortDescription:
        'Safeware Protection Plan - extended service agreement - 2 years - depot',
      longDescription:
        'Safeware Protection Plan - Extended service agreement - parts and labor - 2 years - depot - must be purchased within 90 days of the product purchase - $200-$249.99',
      customerDescription: null,
    },
    maturityStatus: 'SELLABLE',
    category: null,
    manufacturer: {
      id: '0007082255',
      name: 'SAFEWARE THE INSURANCE AGENCY INC',
      url: 'www.safeware.com',
      partNumber: 'PBOT250AVRESP24D',
      images: {
        smallImage:
          'https://cdn.cs.1worldsync.com/de/50/de50cf42-e25c-4d1c-9b21-9c85a3cabd2a.jpg',
        largeImage:
          'https://cdn.cs.1worldsync.com/7a/10/7a108859-5901-4ef3-a3f5-2a479b04f7a8.jpg',
      },
    },
    price: {
      productPrices: [
        {
          price: 18.54,
          currency: 'USD',
          priceLabel: 'yourPrice',
        },
        {
          price: 25.99,
          currency: 'USD',
          priceLabel: 'listPrice',
        },
      ],
      contractPrices: [],
      listAndCustomerPrice: true,
      callForPrice: false,
      leasePrice: null,
      assortmentId: null,
      referenceAssortmentId: null,
      contractId: null,
      softwareContractId: null,
    },
    availability: {
      totalQuantity: 0,
      unlimited: true,
      specialMessage: null,
      availabilityMessage: 'unlimited',
      plantsStock: {},
    },
    extendedSpecs: {},
    images: {
      smallImage:
        'https://cdn.cs.1worldsync.com/8a/6b/8a6b756c-0e8d-4750-bc1c-4ed0b770352b.jpg',
      largeImage:
        'https://cdn.cs.1worldsync.com/61/5b/615b8eee-b4ed-42f5-b72f-43583ed3c21d.jpg',
    },
    productFields: {
      plant: '10',
      customerPlant: null,
      group: 'ZF',
      type: 'ZPOS',
      showOnWeb: 'true',
      buyButton: 'true',
      showPrice: 'true',
      softwareDelivery: null,
      countryOfOrigin: null,
      taaComplaint: null,
      softwareLicenseType: null,
      softwareProgramId: null,
      durationInMonths: null,
      marketingText: null,
      itemCategoryGroup: 'ZWRN',
      generalItemCategory: 'ZWRN',
    },
    bullets: {
      bullet1: 'Type: Extended service agreement',
      bullet2: 'Service Included: Parts and labor',
      bullet3: 'Location: Depot',
      bullet4: 'Full Contract Period: 2 Years',
    },
    containedProducts: [],
    discontinued: false,
    approved: false,
    standard: false,
    unspscCode: null,
  },
  {
    materialId: 'PBOT250AVRAD24D',
    cnetProductId: 'S22681668',
    descriptions: {
      shortDescription:
        'Safeware Protection Plan with Accidental Damage from Handling - extended service agreement - 2 years - depot',
      longDescription:
        'Safeware Protection Plan with Accidental Damage from Handling - Extended service agreement - parts and labor - 2 years - depot - must be purchased within 90 days of the product purchase - $200-$249.99',
      customerDescription: null,
    },
    maturityStatus: 'SELLABLE',
    category: null,
    manufacturer: {
      id: '0007082255',
      name: 'SAFEWARE THE INSURANCE AGENCY INC',
      url: 'www.safeware.com',
      partNumber: 'PBOT250AVRAD24D',
      images: {
        smallImage:
          'https://cdn.cs.1worldsync.com/de/50/de50cf42-e25c-4d1c-9b21-9c85a3cabd2a.jpg',
        largeImage:
          'https://cdn.cs.1worldsync.com/7a/10/7a108859-5901-4ef3-a3f5-2a479b04f7a8.jpg',
      },
    },
    price: {
      productPrices: [
        {
          price: 26.46,
          currency: 'USD',
          priceLabel: 'yourPrice',
        },
        {
          price: 36.99,
          currency: 'USD',
          priceLabel: 'listPrice',
        },
      ],
      contractPrices: [],
      listAndCustomerPrice: true,
      callForPrice: false,
      leasePrice: null,
      assortmentId: null,
      referenceAssortmentId: null,
      contractId: null,
      softwareContractId: null,
    },
    availability: {
      totalQuantity: 0,
      unlimited: true,
      specialMessage: null,
      availabilityMessage: 'unlimited',
      plantsStock: {},
    },
    extendedSpecs: {},
    images: {
      smallImage:
        'https://cdn.cs.1worldsync.com/8a/6b/8a6b756c-0e8d-4750-bc1c-4ed0b770352b.jpg',
      largeImage:
        'https://cdn.cs.1worldsync.com/61/5b/615b8eee-b4ed-42f5-b72f-43583ed3c21d.jpg',
    },
    productFields: {
      plant: '10',
      customerPlant: null,
      group: 'ZF',
      type: 'ZPOS',
      showOnWeb: 'true',
      buyButton: 'true',
      showPrice: 'true',
      softwareDelivery: null,
      countryOfOrigin: null,
      taaComplaint: null,
      softwareLicenseType: null,
      softwareProgramId: null,
      durationInMonths: null,
      marketingText: null,
      itemCategoryGroup: 'ZWRN',
      generalItemCategory: 'ZWRN',
    },
    bullets: {
      bullet1: 'Type: Extended service agreement',
      bullet2: 'Service Included: Parts and labor',
      bullet3: 'Location: Depot',
      bullet4: 'Full Contract Period: 2 Years',
    },
    containedProducts: [],
    discontinued: false,
    approved: false,
    standard: false,
    unspscCode: null,
  },
  {
    materialId: 'PBOT250AVRESP36D',
    cnetProductId: 'S22606428',
    descriptions: {
      shortDescription:
        'Safeware Protection Plan - extended service agreement - 3 years - depot',
      longDescription:
        'Safeware Protection Plan - Extended service agreement - parts and labor - 3 years - depot - must be purchased within 90 days of the product purchase - $200-$249.99',
      customerDescription: null,
    },
    maturityStatus: 'SELLABLE',
    category: null,
    manufacturer: {
      id: '0007082255',
      name: 'SAFEWARE THE INSURANCE AGENCY INC',
      url: 'www.safeware.com',
      partNumber: 'PBOT250AVRESP36D',
      images: {
        smallImage:
          'https://cdn.cs.1worldsync.com/de/50/de50cf42-e25c-4d1c-9b21-9c85a3cabd2a.jpg',
        largeImage:
          'https://cdn.cs.1worldsync.com/7a/10/7a108859-5901-4ef3-a3f5-2a479b04f7a8.jpg',
      },
    },
    price: {
      productPrices: [
        {
          price: 30.83,
          currency: 'USD',
          priceLabel: 'yourPrice',
        },
        {
          price: 42.99,
          currency: 'USD',
          priceLabel: 'listPrice',
        },
      ],
      contractPrices: [],
      listAndCustomerPrice: true,
      callForPrice: false,
      leasePrice: null,
      assortmentId: null,
      referenceAssortmentId: null,
      contractId: null,
      softwareContractId: null,
    },
    availability: {
      totalQuantity: 0,
      unlimited: true,
      specialMessage: null,
      availabilityMessage: 'unlimited',
      plantsStock: {},
    },
    extendedSpecs: {},
    images: {
      smallImage:
        'https://cdn.cs.1worldsync.com/8a/6b/8a6b756c-0e8d-4750-bc1c-4ed0b770352b.jpg',
      largeImage:
        'https://cdn.cs.1worldsync.com/61/5b/615b8eee-b4ed-42f5-b72f-43583ed3c21d.jpg',
    },
    productFields: {
      plant: '10',
      customerPlant: null,
      group: 'ZF',
      type: 'ZPOS',
      showOnWeb: 'true',
      buyButton: 'true',
      showPrice: 'true',
      softwareDelivery: null,
      countryOfOrigin: null,
      taaComplaint: null,
      softwareLicenseType: null,
      softwareProgramId: null,
      durationInMonths: null,
      marketingText: null,
      itemCategoryGroup: 'ZWRN',
      generalItemCategory: 'ZWRN',
    },
    bullets: {
      bullet1: 'Type: Extended service agreement',
      bullet2: 'Service Included: Parts and labor',
      bullet3: 'Location: Depot',
      bullet4: 'Full Contract Period: 3 Years',
    },
    containedProducts: [],
    discontinued: false,
    approved: false,
    standard: false,
    unspscCode: null,
  },
  {
    materialId: 'PBOT250AVRAD36D',
    cnetProductId: 'S22606427',
    descriptions: {
      shortDescription:
        'Safeware Protection Plan with Accidental Damage from Handling - extended service agreement - 3 years - depot',
      longDescription:
        'Safeware Protection Plan with Accidental Damage from Handling - Extended service agreement - parts and labor - 3 years - depot - must be purchased within 90 days of the product purchase - $200-$249.99',
      customerDescription: null,
    },
    maturityStatus: 'SELLABLE',
    category: null,
    manufacturer: {
      id: '0007082255',
      name: 'SAFEWARE THE INSURANCE AGENCY INC',
      url: 'www.safeware.com',
      partNumber: 'PBOT250AVRAD36D',
      images: {
        smallImage:
          'https://cdn.cs.1worldsync.com/de/50/de50cf42-e25c-4d1c-9b21-9c85a3cabd2a.jpg',
        largeImage:
          'https://cdn.cs.1worldsync.com/7a/10/7a108859-5901-4ef3-a3f5-2a479b04f7a8.jpg',
      },
    },
    price: {
      productPrices: [
        {
          price: 43.96,
          currency: 'USD',
          priceLabel: 'yourPrice',
        },
        {
          price: 60.99,
          currency: 'USD',
          priceLabel: 'listPrice',
        },
      ],
      contractPrices: [],
      listAndCustomerPrice: true,
      callForPrice: false,
      leasePrice: null,
      assortmentId: null,
      referenceAssortmentId: null,
      contractId: null,
      softwareContractId: null,
    },
    availability: {
      totalQuantity: 0,
      unlimited: true,
      specialMessage: null,
      availabilityMessage: 'unlimited',
      plantsStock: {},
    },
    extendedSpecs: {},
    images: {
      smallImage:
        'https://cdn.cs.1worldsync.com/8a/6b/8a6b756c-0e8d-4750-bc1c-4ed0b770352b.jpg',
      largeImage:
        'https://cdn.cs.1worldsync.com/61/5b/615b8eee-b4ed-42f5-b72f-43583ed3c21d.jpg',
    },
    productFields: {
      plant: '10',
      customerPlant: null,
      group: 'ZF',
      type: 'ZPOS',
      showOnWeb: 'true',
      buyButton: 'true',
      showPrice: 'true',
      softwareDelivery: null,
      countryOfOrigin: null,
      taaComplaint: null,
      softwareLicenseType: null,
      softwareProgramId: null,
      durationInMonths: null,
      marketingText: null,
      itemCategoryGroup: 'ZWRN',
      generalItemCategory: 'ZWRN',
    },
    bullets: {
      bullet1: 'Type: Extended service agreement',
      bullet2: 'Service Included: Parts and labor',
      bullet3: 'Location: Depot',
      bullet4: 'Full Contract Period: 3 Years',
    },
    containedProducts: [],
    discontinued: false,
    approved: false,
    standard: false,
    unspscCode: null,
  },
]

export const INVALID_ID_TEXT =
  'The following part number you entered could not be found:'
export const INVALID_IDS_TEXT =
  'The following part numbers you entered could not be found:'
export const CONTACT_MESSAGE =
  'Please contact your Account Executive for further information.'
export const CARRIER_OPTION_MESSAGE = 'A shipping carrier is required.'
export const EMAIL_INVALID_MESSAGE = 'Please enter a valid Notification email(s).'
export const ADDRESS_TYPE = {
  SHIPPING:'shipping',
  BILLING:'billing'
}
export const SHIPPING_ADDRESS = 'shipping-address'
export const SHIPPING_OPTIONS = 'shipping-options'
export const BILLING_ADDRESS = 'billing-address'
export const shoppingInfoSequence = {
  'shipping-address': 0,
  'shipping-options': 1,
  'billing-address':2
}
export const creationStatusDescriptionText = {
  ADDR_CREATE_SUCCESS: t('Address created'),
  EXISTING_ADDRESS: t('The address already exists.'),
  DUPLICATE_NICKNAME: t('The favorite name entered already exists.'),
  ADDRESS_CREATION_FAILED: t('Address creation in SAP failed'),
  ADDRESS_VERIFICATION_FAILED: t('Address could not be verified.'),
  INTERNAL_ERROR: t('An issue exists with the shipping/billing address. Please contact your account representative for more information.'),
  SAP_SUGESSTED_ADDRESS: t('There is an issue with the entered address.  Please use the suggested address or modify the address as necessary.'),
  TAX_JURISDICTION_DETERMINATION_FAILED: t('An issue exists with the shipping/billing address. Please contact your account representative for more information.'),
}
export const ADDRESS_VERIFICATION_FAILED = 'ADDRESS_VERIFICATION_FAILED'
export const BACKORDER_MESSAGE = 'Backordered items will ship when available.'
export const STATE = {
  'CALIFORNIA': 'CA'
}
export const IMAGE_SIZES = {
  SM: 'SM',
  MD: 'MD',
  LG: 'LG',
}

export const PURCHASE_CHECKOUT_TYPE = {
  GUEST_CHECKOUT: 'Guest Checkout',
}
export const GUEST_CHECKOUT_ENABLED = 'guest-checkout-enabled'
export const DEFAULT_IMAGE = '/content/dam/insight-web/source/img/noImageAvailable_150x112.png';
