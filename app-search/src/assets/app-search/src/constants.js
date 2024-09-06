import { t } from '@insight/toolkit-utils'

export const ILISTVIEW = {
  list: 'list',
  grid: 'grid',
}

export const solutionProductTile = {
  indexToInsert: 18,
  solutionsTileToPick: 5,
  showOnlyForPage: 1,
  defaultTileCount: 6
}
export const SORTOPTIONS = [
  { text: 'Best match', value: 'best_match' },
  { text: 'Price high to low', value: 'price_descending' },
  { text: 'Price low to high', value: 'price_ascending' },
  // { text: 'Average rating', value: 'review_metric [descending]' },
]
export const PAGECOUNTPRODUCTOPTIONS = [
  { text: '20', value: 20 },
  { text: '50', value: 50 },
  { text: '100', value: 100 },
]

export const PRICELABELMAP = {
  "COIPRICELABEL": "Client owned price",
  "CSIPRICELABEL": "Client supplied price",
  "YOURPRICELABEL": "Your price"
}

export const getPageCountOptions = () => [
  { text: t('Display 20 per page'), value: 20 },
  { text: t('Display 50 per page'), value: 50 },
  { text: t('Display 100 per page'), value: 100 },
];

export const ADD_TO_CART_CATEGORY_TYPES = {
  MAIN_SEARCH_RESULTS: 'Main Search'
}

export const CONTENTMAP = {
  products: {
    id: 'products',
    name: 'Products',
  },
  brands: {
    id: 'brands',
    name: 'Brands',
  },
  articles: {
    id: 'articles',
    name: 'Articles and resources',
  },
  solutions: {
    id: 'solutions',
    name: 'Solutions',
  },
  solutionsAndServices: {
    id: 'solutionsAndServices',
    name: 'Solutions & services',
  },
}

export const DEFAULT_SORT_OPTION = 'best-match';
export const DEFAULT_PAGE_COUNT = 50;
export const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = 'insight_current_locale';
export const FF_SOLUTIONS_SEARCH = "GNA-12965-SOLUTIONS-SEARCH"

export const REGIONS = {
  EMEA: 'EMEA',
  APAC: 'APAC',
  NA: 'NA',
};

export const IPS_CONTRACT_NAME_COOKIE_NAME = 'ips-contract-name'
export const IPS_CONTRACT_ID_COOKIE_NAME = 'ips-contract-id'
export const IPS_HIDE_PRICE_COOKIE_NAME = 'ips-hide-price'
export const IPS_PAGE_URL_COOKIE_NAME = 'ips-page-url'


export const CONTRACT_TYPE_ALL = 'All'
export const CONTRACT_TYPE_OPEN_MARKET = 'openMarket'

export const CONTRACT_ALL = {
  displayName: CONTRACT_TYPE_ALL,
  contractNumber: null,
  contractName: CONTRACT_TYPE_ALL,
}

export const CONTRACT_OPEN_MARKET = {
  displayName: 'Open market',
  contractNumber: null,
  contractName: CONTRACT_TYPE_OPEN_MARKET,
}

export const CONTRACT_LOADING_MESSAGE = "Loading contracts and prices"
export const CONTRACT_TIMED_OUT_MESSAGE = "Unable to load contract prices. Visit the product page for details."
export const CALL_FOR_PRICE = "Contact us for Pricing"

export const getRecommendationsInfo = [
  {
    "placementId": "add_to_cart_page.rr_accessories",
    "prodList": [
      {
        "materialId": "MK2E3AM/A",
        "name": "Apple Magic Mouse - mouse - Bluetooth",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MK2E3AM/A",
        "image": "https://cdn.cs.1worldsync.com/7e/a4/7ea4298e-9e99-405c-b75c-a48935006f77.jpg",
        "description": "Apple Magic Mouse - mouse - Bluetooth",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=0&p=MK2E3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MK2E3AM%2FA/APPLE/MK2E3AM%2FA/Apple-Magic-Mouse---mouse---Bluetooth/",
        "cesSpecs": "Device Type: Mouse|Features: Scrolling, gesture function, rechargeable battery|Warranty: 1 Year",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMK2E3AM%252FA%2FAPPLE%2FMK2E3AM%252FA%2FApple-Magic-Mouse---mouse---Bluetooth%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=0&p=MK2E3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "79.00",
          "currency": "USD",
          "listPrice": "79.00",
          "cesPrice": "78.99"
        }
      },
      {
        "materialId": "MHJA3AM/A",
        "name": "Apple 20W USB-C Power Adapter power adapter - 24 pin USB-C - 20 Watt",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MHJA3AM/A",
        "image": "https://cdn.cs.1worldsync.com/de/c5/dec5fd95-86f6-491e-9c2e-b90fd4e94627.jpg",
        "description": "Apple 20W USB-C Power Adapter power adapter - 24 pin USB-C - 20 Watt",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=1&p=MHJA3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MHJA3AM%2FA/APPLE/MHJA3AM%2FA/Apple-20W-USB-C-Power-Adapter-power-adapter---24-pin-USB-C---20-Watt/",
        "cesSpecs": "Product Type: Power adapter|Designed For: Tablet, Cellular phone",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMHJA3AM%252FA%2FAPPLE%2FMHJA3AM%252FA%2FApple-20W-USB-C-Power-Adapter-power-adapter---24-pin-USB-C---20-Watt%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=1&p=MHJA3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "19.00",
          "currency": "USD",
          "listPrice": "19.00",
          "cesPrice": "17.99"
        }
      },
      {
        "materialId": "MU2G3AM/A",
        "name": "Apple - 240W USB-C Charge Cable (2 m)",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MU2G3AM/A",
        "image": "https://cdn.cs.1worldsync.com/b6/94/b6949fef-939e-4528-adff-bb573f213788.jpg",
        "description": "Apple - 240W USB-C Charge Cable (2 m)",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=2&p=MU2G3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MU2G3AM%2FA/APPLE/MU2G3AM%2FA/Apple---240W-USB-C-Charge-Cable--2-m-/",
        "cesSpecs": "Cable Type: USB-C cable|Left Connector: 24 pin USB-C (Male)",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMU2G3AM%252FA%2FAPPLE%2FMU2G3AM%252FA%2FApple---240W-USB-C-Charge-Cable--2-m-%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=2&p=MU2G3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "29.00",
          "currency": "USD",
          "listPrice": "29.00",
          "cesPrice": "29.99"
        }
      },
      {
        "materialId": "MQ052LL/A",
        "name": "Apple Magic Keyboard with Numeric Keypad - keyboard - US - silver",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MQ052LL/A",
        "image": "https://cdn.cs.1worldsync.com/54/ce/54ceaf50-80ff-48cb-af9e-6e0190e89106.jpg",
        "description": "Apple Magic Keyboard with Numeric Keypad - keyboard - US - silver",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=3&p=MQ052LL%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MQ052LL%2FA/APPLE/MQ052LL%2FA/Apple-Magic-Keyboard-with-Numeric-Keypad---keyboard---US---silver/",
        "cesSpecs": "Device Type: Keyboard|Connectivity Technology: Wireless",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMQ052LL%252FA%2FAPPLE%2FMQ052LL%252FA%2FApple-Magic-Keyboard-with-Numeric-Keypad---keyboard---US---silver%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=3&p=MQ052LL%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "129.00",
          "currency": "USD",
          "listPrice": "129.00",
          "cesPrice": "127.99"
        }
      },
      {
        "materialId": "MX0J2AM/A",
        "name": "Apple USB-C - power adapter - 96 Watt",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MX0J2AM/A",
        "image": "https://cdn.cs.1worldsync.com/c0/9c/c09c78b9-f1f7-42a9-ab45-08af2aa1c639.jpg",
        "description": "Apple USB-C - power adapter - 96 Watt",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=4&p=MX0J2AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MX0J2AM%2FA/APPLE/MX0J2AM%2FA/Apple-USB-C---power-adapter---96-Watt/",
        "cesSpecs": "Device Type: Power adapter|Product Line: Apple",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMX0J2AM%252FA%2FAPPLE%2FMX0J2AM%252FA%2FApple-USB-C---power-adapter---96-Watt%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=4&p=MX0J2AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "79.00",
          "currency": "USD",
          "listPrice": "79.00",
          "cesPrice": "78.99"
        }
      },
      {
        "materialId": "MK2D3AM/A",
        "name": "Apple Magic Trackpad - trackpad - Bluetooth",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MK2D3AM/A",
        "image": "https://cdn.cs.1worldsync.com/61/d3/61d3db70-91ac-4bbb-a8ef-3d47d9bc3192.jpg",
        "description": "Apple Magic Trackpad - trackpad - Bluetooth",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=5&p=MK2D3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MK2D3AM%2FA/APPLE/MK2D3AM%2FA/Apple-Magic-Trackpad---trackpad---Bluetooth/",
        "cesSpecs": "Device Type: Trackpad|Features: Multi-gesture touch pad, Force Touch, rechargeable battery|Warranty: 1 Year",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMK2D3AM%252FA%2FAPPLE%2FMK2D3AM%252FA%2FApple-Magic-Trackpad---trackpad---Bluetooth%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=5&p=MK2D3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "129.00",
          "currency": "USD",
          "listPrice": "129.00",
          "cesPrice": "127.99"
        }
      },
      {
        "materialId": "MQKJ3AM/A",
        "name": "Apple - USB-C cable - 24 pin USB-C (M) to 24 pin USB-C (M) - 3.3 ft - for 10.9-inch iPad; 10.9-inch iPad Air; 11-inch iPad Pro; 12.9-inch iPad Pro; iMac Pro",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MQKJ3AM/A",
        "image": "https://cdn.cs.1worldsync.com/c5/8a/c58a519e-92f1-47d3-9553-73c21fc56493.jpg",
        "description": "Apple - USB-C cable - 24 pin USB-C (M) to 24 pin USB-C (M) - 3.3 ft - for 10.9-inch iPad; 10.9-inch iPad Air; 11-inch iPad Pro; 12.9-inch iPad Pro; iMac Pro",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=6&p=MQKJ3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MQKJ3AM%2FA/APPLE/MQKJ3AM%2FA/Apple---USB-C-cable---24-pin-USB-C--M--to-24-pin-USB-C--M----3-3-ft---for-10-9-inch-iPad--10-9-inch-iPad-Air--11-inch-iPad-Pro--12-9-inch-iPad-Pro--iMac-Pro/",
        "cesSpecs": "Cable Type: USB-C cable|Left connector: 24 pin USB-C Male|Warranty: 1 Year",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMQKJ3AM%252FA%2FAPPLE%2FMQKJ3AM%252FA%2FApple---USB-C-cable---24-pin-USB-C--M--to-24-pin-USB-C--M----3-3-ft---for-10-9-inch-iPad--10-9-inch-iPad-Air--11-inch-iPad-Pro--12-9-inch-iPad-Pro--iMac-Pro%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=6&p=MQKJ3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "19.00",
          "currency": "USD",
          "listPrice": "19.00",
          "cesPrice": "19.99"
        }
      },
      {
        "materialId": "MK2A3LL/A",
        "name": "Apple Magic Keyboard - keyboard - QWERTY - US",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MK2A3LL/A",
        "image": "https://cdn.cs.1worldsync.com/2f/7b/2f7ba963-2e69-42ee-a980-407fdc02bc7c.jpg",
        "description": "Apple Magic Keyboard - keyboard - QWERTY - US",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=7&p=MK2A3LL%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MK2A3LL%2FA/APPLE/MK2A3LL%2FA/Apple-Magic-Keyboard---keyboard---QWERTY---US/",
        "cesSpecs": "Device Type: Keyboard|Connectivity Technology: Wireless|Warranty: 1 Year",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMK2A3LL%252FA%2FAPPLE%2FMK2A3LL%252FA%2FApple-Magic-Keyboard---keyboard---QWERTY---US%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=7&p=MK2A3LL%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "99.00",
          "currency": "USD",
          "listPrice": "99.00",
          "cesPrice": "97.99"
        }
      },
      {
        "materialId": "MMMQ3AM/A",
        "name": "Apple Magic Mouse - mouse - Bluetooth - black",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MMMQ3AM/A",
        "image": "https://cdn.cs.1worldsync.com/10/f8/10f8a750-72b0-4172-afd0-2252634b9aef.jpg",
        "description": "Apple Magic Mouse - mouse - Bluetooth - black",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=8&p=MMMQ3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MMMQ3AM%2FA/APPLE/MMMQ3AM%2FA/Apple-Magic-Mouse---mouse---Bluetooth---black/",
        "cesSpecs": "Device Type: Mouse|Features: Scrolling, gesture function, rechargeable battery|Warranty: 1 Year",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMMMQ3AM%252FA%2FAPPLE%2FMMMQ3AM%252FA%2FApple-Magic-Mouse---mouse---Bluetooth---black%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=8&p=MMMQ3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "99.00",
          "currency": "USD",
          "listPrice": "99.00",
          "cesPrice": "97.99"
        }
      },
      {
        "materialId": "MLYU3AM/A",
        "name": "Apple USB-C - power adapter - 140 Watt",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "MLYU3AM/A",
        "image": "https://cdn.cs.1worldsync.com/b0/4d/b04d2adc-82df-4ec5-abf3-31427a15f1ef.jpg",
        "description": "Apple USB-C - power adapter - 140 Watt",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=9&p=MLYU3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/MLYU3AM%2FA/APPLE/MLYU3AM%2FA/Apple-USB-C---power-adapter---140-Watt/",
        "cesSpecs": "Device Type: Power adapter|Product Line: Apple|Warranty: 1 Year",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FMLYU3AM%252FA%2FAPPLE%2FMLYU3AM%252FA%2FApple-USB-C---power-adapter---140-Watt%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=58527&pti=13&pa=23936&pos=9&p=MLYU3AM%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "99.00",
          "currency": "USD",
          "listPrice": "99.00",
          "cesPrice": "97.99"
        }
      }
    ],
    "strategyMessage": "Notebooks accessories"
  },
  {
    "placementId": "add_to_cart_page.rr_warranties",
    "prodList": [
      {
        "materialId": "SGAQ2LL/A",
        "name": "AppleCare+ - extended service agreement - 3 years - for 14-inch MacBook Pro (M2)",
        "manufacturerName": "APPLE",
        "manufacturerPartNumber": "SGAQ2LL/A",
        "image": "https://cdn.cs.1worldsync.com/1e/61/1e61fe97-b83b-4fc1-9852-5a8c4d616ed6.jpg",
        "description": "AppleCare+ - extended service agreement - 3 years - for 14-inch MacBook Pro (M2)",
        "clickTrackingURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=63606&pti=13&pa=23935&pos=0&p=SGAQ2LL%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "productURL": "/en_US/shop/product/SGAQ2LL%2FA/APPLE/SGAQ2LL%2FA/AppleCare----extended-service-agreement---3-years---for-14-inch-MacBook-Pro--M2-/",
        "cesSpecs": "Product Line: AppleCare+|Service Included: Parts and labor|Full Contract Period: 3 years",
        "clickURL": "https://integration.richrelevance.com/rrserver/apiclick?a=3d55dfaade275f8c&cak=2b06e6faed1ba009&channelId=2b06e6faed1ba009&ct=http%3A%2F%2Fwww.insight.com%2Fen_US%2Fshop%2Fproduct%2FSGAQ2LL%252FA%2FAPPLE%2FSGAQ2LL%252FA%2FAppleCare----extended-service-agreement---3-years---for-14-inch-MacBook-Pro--M2-%2F&vg=9e60ad95-0584-42a4-1404-e46376598cc9&stid=300&amrId=63606&pti=13&pa=23935&pos=0&p=SGAQ2LL%2FA&s=1983C119C6DFEC792C0AD701AE4FB5D1.%24%7Benv.jvmRoute%7D&rid=en_US&qsgs=13794%7C8637%7C8657%7C8271&mvtId=-1&mvtTs=1708750701178",
        "price": {
          "price": "279.00",
          "currency": "USD",
          "listPrice": "270.99",
          "cesPrice": "234.99"
        }
      }
    ],
    "strategyMessage": "Warranties"
  }
]
