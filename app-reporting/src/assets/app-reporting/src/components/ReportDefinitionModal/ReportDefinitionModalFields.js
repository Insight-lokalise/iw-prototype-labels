import { REPORT_DEFINITION_LABELS } from '../../texts';

const {
  DELIMITER_LABELS,
  ACCOUNT_LEVEL_LABELS,
} = REPORT_DEFINITION_LABELS;

export const VIEW_REPORT_MODAL_FIELD_IDS = {
  EMAIL: 'emailaddress',
  FTPLOCATION: 'ftpLocation',
  ACCOUNTLEVEL: 'account_level',
  DELIMITERTYPE: 'delimiterType',
  DELIMITERVALUE: 'delimiterValue',
  DELIVERYMETHOD: 'delivery_method',
  TRACKINGNUMBER: 'trackingNumber',
}

export const DELIVERY_METHODS = {
  FTP: 'ftp',
  EMAIL: 'email',
}

export const DELIMITER_TYPES = {
  '1': DELIMITER_LABELS.TAB,
  '2': DELIMITER_LABELS.SEMICOLON,
  '3': DELIMITER_LABELS.COMMA,
  '4': DELIMITER_LABELS.SPACE,
}

export const ACCOUNT_LEVELS = {
  '1': ACCOUNT_LEVEL_LABELS.ALL_MY_ACCOUNTS,
  '2': ACCOUNT_LEVEL_LABELS.REPORTING_PARENT,
  '3': ACCOUNT_LEVEL_LABELS.REPORTING_GRAND_PARENT,
  '4': ACCOUNT_LEVEL_LABELS.GREAT_GRAND_PARENT,
  '5': ACCOUNT_LEVEL_LABELS.CUSTOM_LIST_OF_SELECTED_ACCOUNT,
}

export const VIEW_REPORT_MODAL_FIELDS = [
  {
    id: VIEW_REPORT_MODAL_FIELD_IDS.TRACKINGNUMBER,
    label: REPORT_DEFINITION_LABELS.TRACKING_NUMBER,
  },
  {
    id: 'selectedReport',
    label: REPORT_DEFINITION_LABELS.REPORT_NAME,
  },
  {
    id: 'interval',
    label: REPORT_DEFINITION_LABELS.INTERVAL,
  },
  {
    id: 'accumulateResults',
    label: REPORT_DEFINITION_LABELS.ACCUMULATE_RESULTS,
  },
  {
    id: 'delivery_format',
    label: REPORT_DEFINITION_LABELS.FORMAT,
  },
  {
    id: VIEW_REPORT_MODAL_FIELD_IDS.DELIVERYMETHOD,
    label: REPORT_DEFINITION_LABELS.DELIVERY_METHOD,
  },
  {
    id: 'deliveryDateFormat',
    label: REPORT_DEFINITION_LABELS.DATE_FORMAT,
  },
  {
    id: 'startDate',
    label: REPORT_DEFINITION_LABELS.START_DATE,
  },
  {
    id: 'endDate',
    label: REPORT_DEFINITION_LABELS.SCHEDULED,
  },
  {
    id: 'userName',
    label: REPORT_DEFINITION_LABELS.USER_NAME,
  },
  {
    id: VIEW_REPORT_MODAL_FIELD_IDS.EMAIL,
    label: REPORT_DEFINITION_LABELS.EMAIL,
    delimeter: ',',
  },
  {
    id: VIEW_REPORT_MODAL_FIELD_IDS.FTPLOCATION,
    label: REPORT_DEFINITION_LABELS.FTP_LOCATION,
  },
  {
    id: 'customFileName',
    label: REPORT_DEFINITION_LABELS.CUSTOM_NAME,
  },
  {
    id: VIEW_REPORT_MODAL_FIELD_IDS.DELIMITERTYPE,
    label: REPORT_DEFINITION_LABELS.DELIMITERS,
  },
  {
    id: 'customernumber',
    label: REPORT_DEFINITION_LABELS.CUSTOMER_NUMBER,
  },
  {
    id: VIEW_REPORT_MODAL_FIELD_IDS.ACCOUNTLEVEL,
    label: REPORT_DEFINITION_LABELS.ACCOUNT_LEVEL,
  },
  {
    id: 'adhocColumns',
    label: REPORT_DEFINITION_LABELS.ADHOC_COLUMN,
    delimeter: ',',
  },
  {
    id: 'smartTrackerDetailFlag',
    label: REPORT_DEFINITION_LABELS.SMARTTRACKER,
  },
  {
    id: 'currencyFilter',
    label: REPORT_DEFINITION_LABELS.CURRENCY,
  },
  {
    id: 'accountHeirarchy',
    label: REPORT_DEFINITION_LABELS.ACCOUNTS,
  },
  {
    id: 'manufacturerFilter',
    label: REPORT_DEFINITION_LABELS.MANUFACTURER_FILTER,
    key: 'name',
  },
  {
    id: 'productTypeFilter',
    label: REPORT_DEFINITION_LABELS.SELECTED_PRODUCT_TYPES,
    key: 'name',
  },
  {
    id: 'categoryFilter',
    label: REPORT_DEFINITION_LABELS.SELECTED_PRODUCT_CATEGORY,
    key: 'name',
  },
  {
    id: 'subCategoryFilter',
    label: REPORT_DEFINITION_LABELS.SELECTED_PRODUCT_SUBCATEGORY,
    key: 'name',
  },
  {
    id: 'ipsFlag',
    label: REPORT_DEFINITION_LABELS.INSIGHT_PUBLIC_SECTOR_DATA,
  },
  {
    id: 'partnerDataFlag',
    label: REPORT_DEFINITION_LABELS.PARTNER_DATA,
  },
  {
    id: 'selectedOpsTextLabel',
    label: REPORT_DEFINITION_LABELS.OPERATIONS_CENTER,
  },
  {
    id: 'selectedSalesOrgLabel',
    label: REPORT_DEFINITION_LABELS.REGION,
  },
];