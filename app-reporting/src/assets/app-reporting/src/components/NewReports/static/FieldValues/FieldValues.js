// SOME OF THE DROPDOWN VALUES ARE HARDCODED HERE
// PLEASE REMOVE ONCE OPTIONS WAS RETREIVED FROM API

export const CURRENCY = [
    { text: 'AUD', value: 'AUD' },
    { text: 'CAD', value: 'CAD' },
    { text: 'CHF', value: 'CHF' },
    { text: 'CNY', value: 'CNY' },
    { text: 'DKK', value: 'DKK' },
    { text: 'EUR', value: 'EUR' },
    { text: 'GBP', value: 'GBP' },
    { text: 'HKD', value: 'HKD' },
    { text: 'JPY', value: 'JPY' },
    { text: 'NOK', value: 'NOK' },
    { text: 'NZD', value: 'NZD' },
    { text: 'SEK', value: 'SEK' },
    { text: 'SGD', value: 'SGD' },
    { text: 'USD', value: 'USD' },
]

export const SCHEDULE_REPORT_DROPDOWN = [
    { text: 'Run Report Now', value: 'Now' },
    { text: 'Schedule Report Daily', value: 'Daily' },
    { text: 'Schedule Report Weekly', value: 'Weekly' },
    { text: 'Schedule Report Monthly', value: 'Monthly' },
    { text: 'Schedule Report Quarterly', value: 'Quarterly' },
    { text: 'Schedule Report Yearly', value: 'Yearly' },
    { text: 'Save Report Definition as Template', value: 'save' },
]

export const FILTER_DATE_RANGE_DROPDOWN = [
    { text: 'Current Month', value: 0 },
    { text: 'Current Quarter', value: 1 },
    { text: 'Current Year', value: 2 },
    { text: 'Last Month', value: 3 },
    { text: 'Last Quarter', value: 4 },
    { text: 'Last Full Year', value: 5 },
    { text: 'Custom Date', value: 99 }
]

export const FILTER_DATE_OPTIONS = [
    {
        value: 1,
        text: 'Order Date',
        label: 'Order Date',
        id: 'orderDate'
    },
    {
        value: 2,
        text: 'Invoice Date',
        label: 'Invoice Date',
        id: 'invoiceDate'
    }
]

export const FILTER_BY_CURRENCY_OPTIONS = {
    ACCT: {
        value: 'ACCT',
        text: 'Display all transactions in the currency of the billing account',
        id: 'currencyoptionsFilterID'
    },
    SUPPLY: {
        value: 'SUPPLY',
        text: 'Convert all transactions to',
        id: 'currencyoptionsFilterID'
    },
    INVOICED: {
        value: 'INVOICED',
        text: 'Only transaction invoiced in',
        id: 'currencyoptionsFilterID'
    }
}


export const FILTER_TYPE_DROPDOWN = [
    { text: 'All', value: 'ALL' },
    { text: 'Invoiced Orders', value: 'ORDERS' },
    { text: 'Customer Owned Outbound', value: 'OUTBOUND' },
    { text: 'Customer Owned Inbound', value: 'INBOUND' }
]

export const FILTER_BY_PRODUCT = {
    header: 'Filter by Product',
    manufacturers: 'Manufacturers',
    productTypes: 'Product Type',
    categories: 'Product Categories',
    subCategories: 'Product Subcategories',
}

export const FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG = {
  checkboxLabel: 'Display serial number / asset tag information on individual lines',
  value: '0',
  name: 'Partner Data'
}

export const FILTER_PRODUCT_CHECKBOX_PARTNER_DATA = {
  checkboxLabel: 'Include Insight Partner Data',
  value: '1',
  name: 'Serial Number Asset Tag'
}

export const SMART_TRACKER_FILTER = [
    { text: 'Add a SmartTracker Filters', value: 'Add a SmartTracker Filters' },
    { text: 'Add a SmartTracker Filters', value: 'Add a SmartTracker Filters' },
]

export const REPORT_NAME = [
    { text: 'Standard Report Name', value: 'Standard Report Name' },
    { text: 'Custom Report Name', value: 'Custom Report Name' },
]

export const DATE_FORMAT = [
    {value: "canadaDateFormat", text: "dd-mm-yyyy (20-04-2013)"},
    {value: "chinaDateFormat", text: "yyyy-mm-dd (2013-04-20)"},
    {value: "internationalDateFormat", text: "dd-Mmm-yyyy (20-Apr-2013)"},
    {value: "usDateFormat", text: "mm-dd-yyyy (04-20-2013)"}
]

export const FORMAT_OPTIONS = [
    { id: 'tab', label: 'Tab', value: 'tab'},
    { id: 'semicolon', label: 'Semicolon', value: 'semicolon'},
    { id: 'comma', label: 'Comma', value: 'comma'},
    { id: 'space', label: 'Space', value: 'space'},
    { id: 'other', label: 'Other', value: 'other'}
]

export const ACCOUNT_SELECTION_DROPDOWN = [
    {
      "text": "Account I am logged into",
      "value": '0',
      "selected": "N"
    },
    {
      "text": "All My Accounts",
      "value": 1,
      "selected": "Y"
    },
    {
      "text": "Accounts under the current reporting Parent",
      "value": 2,
      "selected": "N"
    },
    {
      "text": "Accounts under the current reporting Grand Parent",
      "value": 3,
      "selected": "N"
    },
    {
      "text": "Accounts under the current reporting Great Grand Parent",
      "value": 4,
      "selected": "N"
    },
    {
      "text": "Select Custom List of Accounts",
      "value": 5,
      "selected": "N"
    }
]

export const ACCOUNT_SELECTION_DROPDOWN_REGION = [
    {
      "text": "Account I am logged into",
      "value": '0',
      "selected": "N"
    },
    {
      "text": "All My Accounts",
      "value": 1,
      "selected": "Y"
    },
    {
        "text": "Account by Region",
        "value": '4b',
        "selected": "N"
    },
    {
      "text": "Accounts under the current reporting Parent",
      "value": 2,
      "selected": "N"
    },
    {
      "text": "Accounts under the current reporting Grand Parent",
      "value": 3,
      "selected": "N"
    },
    {
      "text": "Accounts under the current reporting Great Grand Parent",
      "value": 4,
      "selected": "N"
    },
    {
      "text": "Select Custom List of Accounts",
      "value": 5,
      "selected": "N"
    }
  ];

export const ALL_OPTIONS = [{
    text: "All",
    value: "All",
    id: "All",
    checkboxLabel: "All",
    checked: false
}]