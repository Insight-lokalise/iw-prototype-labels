// Routing constants
export const PAGE_ROUTE = {
  REPORTING_LANDING_URL: "/reportingManagement",
  // TODO - Update path to new report route
  NEW_REPORT_URL: "/reportingManagement/newReport",
};

export const ROUTE_MAPS = {
  REPORTING_LANDING: 'REPORTING_LANDING', 
}

export const ROUTES = {
  [ROUTE_MAPS.REPORTING_LANDING]: {
    url: PAGE_ROUTE.REPORTING_LANDING_URL,
    name: "Reporting Management",
  },
};

export const HOME_PAGE_URL = '/insightweb/welcome';

// Cookie constants
export const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = "insight_current_locale";

// API Endpoints
export const API_ENDPOINTS = {
  getAccountToolsMenuDetails: '/insightweb/getAccountToolsMenuDetails',
  viewReportsList: '/insightweb/report/viewReportsList',
  getHierarchyTree: '/insightweb/report/getHierarchyTreeNoHtml',
  viewReports: '/insightweb/report/viewReports',
  getRegions: '/insightweb/report/getRegionsByBillTo/report',
  loadReports: '/insightweb/report/loadReport/',
  openReportDefinition: '/insightweb/report/openReportDefinition',
  updateReportEmail: '/insightweb/report/updateReportEmail',
}

// Permissions
export const REPORTING_PERMISSIONS = {
  inventoryReports: 'inventoryReports',
  reports: 'reports',
  softwareReports: 'softwareReports',
  standardReports: 'standardReports',
}

// App Target ID
export const REACT_APP_REPORTING_ELEMENT_ID = 'react-app-reporting';

// Reporting Code key present in URL
export const REPORTING_CODE_KEY = 'RCODE';

// Reporting Management Tabs
export const REPORTING_TABS = {
  NEW_REPORT: {
    id: 'newReport',
    icon: 'plus-icon'
  },
  REPORT_TEMPLATES: {
    id: 'reportTemplates',
    icon: 'report-templates'
  },
  POSTED_REPORTS: {
    id: 'postedReports',
    icon: 'posted-reports',
  },
  SCEHDULED_REPORTS: {
    id: 'scheduledReports',
    icon: 'scheduled-reports',
  },
}

// Access Denied page
export const ACCESS_DENIED_ICON = "access-denied";

export const REPORTS_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const TOAST_DISPLAY_DURATION = 3000;
export const TOAST_FADE_DURATION = 250;

// Region Code
export const REGIONS = {
  INSIGHT_NORTH_AMERICA: {
    name: 'Insight North America',
    code: 'NA*ALL',
  },
  INSIGHT_APAC: {
    name: 'Insight APAC',
    code: 'APAC*ALL',
  },
  INSIGHT_EMEA: {
    name: 'Insight EMEA',
    code: 'EMEA*ALL',
  },
  ALL: {
    name: 'All',
    code: 'ALL*ALL',
  },
}

// Account Selection dropdown code
export const ACCOUNT_SELECTION_CODE = {
  ACCOUNT_LOGGED_IN: '0',
  ALL_ACCOUNTS: '1',
  ACCOUNT_BY_REGION: '4b',
  ACCOUNT_UNDER_REPORTING_PARENT: '2',
  ACCOUNT_UNDER_REPORTING_GRANT_PARENT: '3',
  ACCOUNT_UNDER_REPORTING_GREAT_GRANT_PARENT: '4',
  CUSTOM_LIST: '5',
}

// Filter by products
export const FILTER_PRODUCTS = {
  MANUFACTURERS: 'manufacturers',
  PRODUCT_TYPES: 'productTypes',
  CATEGORIES: 'categories',
  SUB_CATEGORIES: 'subCategories',
  ALL: 'All',
}