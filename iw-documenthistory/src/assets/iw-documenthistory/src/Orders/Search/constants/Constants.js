export const ADVANCED_SEARCH_VIEW = 'advancedSearch'
export const accountTypes = {
  AccountIamloggedinto: 'Account I am logged into',
  AllMyAccounts: 'All of My Accounts',
  AccountsunderthecurrentreportingParent: 'Accounts under the current reporting Parent',
  AccountunderthereportingGrandparent: 'Accounts under the current reporting Grand Parent',
  AccountunderthereportingGreatGrandparent: 'Accounts under the current reporting Great Grand Parent',
  AccountsByRegion: 'Accounts by Region',
}
export const authType = [
  { displayName: 'Account number', value: 'accountNumber' },
  { displayName: 'Shipping postal code', value: 'postalCode' },
  { displayName: 'Contact name', value: 'contactName' },
  { displayName: 'Contact email', value: 'contactEmail' },
]
export const ORDER_HISTORY_VIEW = 'orderHistory'

export const orderTypes = [
  { displayName: 'All open/invoiced orders', value: '0' },
  { displayName: 'Open orders', value: '1' },
  { displayName: 'Invoiced orders', value: '2' },
]
export const PLACE_HOLDER = 'placeHolder'
export const productTypes = [
  { displayName: 'All shipping types', value: '0' },
  { displayName: 'Shippable', value: '1' },
  { displayName: 'Non-shippable', value: '2' },
]
export const PO = 'po'
export const QUICK_SEARCH_VIEW = 'quickSearch'

export const PO_RELEASE_NUMBER = 'poReleaseNumber'
export const INVOICE_NUMBER = 'invoiceNumber'
export const ORDER_NUMBER = 'orderNumber'
export const PART_DESCRIPTION = 'partDescription'
export const PART_NUMBER = 'partNumber'
export const PURCHASE_NUMBER = 'purchaseNumber'
export const REFERENCE_NUMBER = 'referenceNumber'
export const SHIPPING_ADDRESS = 'shippingAddress'
export const VENDOR_NUMBER = 'vendorPONumber'

export const searchBy = [
  { displayName: 'Purchase order', value: PURCHASE_NUMBER },
  { displayName: 'Invoice number', value: INVOICE_NUMBER },
  { displayName: 'Order number', value: ORDER_NUMBER },
  { displayName: 'Part description', value: PART_DESCRIPTION },
  { displayName: 'Part number', value: PART_NUMBER },
  { displayName: 'PO release number', value: PO_RELEASE_NUMBER },
  { displayName: 'Reference number', value: REFERENCE_NUMBER },
  { displayName: 'Shipping address', value: SHIPPING_ADDRESS },
  { displayName: 'Vendor PO number', value: VENDOR_NUMBER },
]
export const searchType = [
  { displayName: 'Order number', value: ORDER_NUMBER },
  { displayName: 'Purchase order', value: PURCHASE_NUMBER },
  { displayName: 'Reference number', value: REFERENCE_NUMBER },
  { displayName: 'Invoice number', value: INVOICE_NUMBER },
]

export const SEARCH_VIEW = {
  orderHistory: 'Order history',
  quickSearch: 'Quick search',
  advancedSearch: 'Advanced search',
}

export const SOLDTO_NAME = 'soldtoName'
export const SOLDTO_NUMBER = 'soldtoNumber'
export const sortOrderBy = [
  { displayName: 'Order date', value: 3 },
  { displayName: 'Order status', value: 6 },
  { displayName: 'Order number', value: 1 },
  { displayName: 'PO number', value: 4 },
]
export const statusList = [
  { displayName: 'All order statuses', value: '0' },
  { displayName: 'On hold', value: '4' },
  { displayName: 'In Progress', value: '1' },
  { displayName: 'Partially shipped', value: '2' },
  { displayName: 'Completed', value: '3' },
]

const today = new Date()
const ninetyDaysPrior = new Date(new Date().setDate(today.getDate() - 90));
export const defaultFilters = {
  searchText: '',
  dateRange: {
    startDate: ninetyDaysPrior,
    endDate: today,
  },
  status: 0,
  productType: 0,
  orderType: 0
}

export const TAB_KEY_CODE = 9;

export const EVENT_TYPES = {
  keydown: 'keydown'
}

export const DATASET_ATTRIBUTES = {
  eventListener: {
    setKey: 'data-event-listener',
    getKey: 'eventListener'
  }
}
