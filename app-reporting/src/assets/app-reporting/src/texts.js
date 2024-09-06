import { reportsInformation } from "./reportsInformation";

const REPORT_HEADERS = {
    REPORT_NAME: 'Report Name',
    CUSTOM_REPORT_NAME: 'Custom Report Name',
    INTERVAL: 'Interval',
    RUN_DATE: 'Run Date',
    FORMAT: 'Format',
    OPTIONS: 'Options',
    TEMPLATE_NAME: 'Template Name',
    LAST_RUN_DATE: 'Last Run Date',
    TRACKING_NUMBER: 'Tracking Number',
    EXPIRY_DATE: 'Exp. Date',
}

const REPORT_OPTIONS = {
    DOWNLOAD: 'Download',
    DELETE: 'Delete',
    EDIT: 'Edit',
    RUN: 'Run',
    CANCEL: 'Cancel',
    VIEW: 'View report definition',
    RENEW: 'Renew',
    CLOSE: 'Close',
}

const API_WARNINGS = {
    FAILED_ACCOUNT_TOOLS_DATA: 'Failed to get account tools menu data',
    FAILED_REPORTS_LIST: 'Failed to fetch Reports list',
    FAILED_REPORTS: 'Failed to fetch Reports',
    FAILED_TO_DELETE_REPORT: 'Failed to delete the report',
    FAILED_TO_FETCH_HIERARCHY: 'Failed to fetch the hierarchy tree',
    FAILED_TO_FETCH_ACCOUNTS: 'Failed to fetch accounts',
    FAILED_TO_REGIONS: 'Failed to fetch regions',
    FAILED_TO_LOAD_REPORTS: 'Failed to load reports',
    FAILED_TO_RENEW_REPORT: 'Failed to renew the report',
    FAILED_TO_FETCH_USER_INFO: 'Failed to fetch user information',
    FAILED_TO_FETCH_REPORT_DEFINITION: 'Failed to fetch Report Definition',
    FAILED_TO_UPDATE_REPORT_EMAIL: 'Failed to update Report email',
}

const EMTPY_STATE_TEXTS = {
    NO_POSTED_REPORTS: {
        text: 'No posted reports found.',
        subText: 'Once reports are submitted, they will appear here.'
    },
    NO_REPORT_TEMPLATES: {
        text: 'No report templates found.',
        subText: "This is your opportunity to create a report from scratch. Let's begin."
    },
    NO_SCHEDULED_REPORTS: {
        text: 'No scheduled reports found.',
        subText: 'Ready to schedule your first report?'
    },
    NO_ACCOUNTS_FOUND: {
        text: 'No accounts found.',
    }
}

const VIEW_REPORT_MODAL_TEXTS = {
    ADD_NEW: 'Add New',
    SAVE: 'Save',
    EMAIL_ERROR: 'At least one email entered is invalid.',
    EMAIL_UPDATE_FAILED: 'Failed to update Report email. Please try again.',
}

export const REPORTING_TEXTS = {
    REPORTING_MANAGEMENT_TITLE: 'Reporting Management',
    // Access Denied texts
    BACK_TO_HOMEPAGE: 'Back to Homepage',
    ACCESS_DENIED_TEXT: "Access Denied. Unfortunately, you don't have permission to view this page",
    ACCESS_DENIED_DESCRIPTION: 'This could be because your user role does not have the necessary privileges to access this tool. Please contact your administrator to request the access.',
    // Tabs
    NEW_REPORT: 'New Report',
    REPORT_TEMPLATES: 'Report Templates',
    POSTED_REPORTS: 'Posted Reports',
    SCEHDULED_REPORTS: 'Scheduled Reports',
    // Subtexts
    POSTED_REPORTS_SUBTEXT: 'Access reports that were conveniently stored for you',
    REPORT_TEMPLATES_SUBTEXT: 'No more re-entering reporting criteria! Save your report settings as a template and run a report quickly using the Template. You can also edit and delete.',
    SCEHDULED_REPORTS_SUBTEXT: 'Easily view the schedule of your re-occurring reports. You can also quickly run the report or delete the schedule.',
    // Information about all the Reports
    REPORTS_INFORMATION: reportsInformation,
    // Actions
    CREATE_REPORT: 'Create Report',
    CSV: 'CSV',
    XLS: 'XLS',
    CREATE: 'Create',
    REPORT: 'Report',
    // Reporting Sections
    REPORT_FORMATS: 'Report Formats',
    SCHEDULED_REPORTING: 'Scheduling Reporting',
    GLOBAL_REPORT: 'Global Report',
    // API warnings
    ...API_WARNINGS,
    // Empty State
    ...EMTPY_STATE_TEXTS,
    // Headers and Options
    REPORT_HEADERS: REPORT_HEADERS,
    REPORT_OPTIONS: REPORT_OPTIONS,
    BACK_TO_REPORT_LIST: 'Back to report list',
    // Delete report
    DELETE_CONFIRMATION_MESSAGE: "You are about to delete the report titled '{{reportName}}' from the {{reportType}}. This action cannot be undone. Are you sure you want to proceed?",
    REPORT_DELETED_SUCCESSFULLY: 'Report Deleted Successfully',
    REPORT_RENEWED_SUCCESSFULLY: 'Report Renewed Successfully',
    VIEW_REPORT_MODAL_TEXTS,
}

export const CREATE_REPORT = {
    STANDARD_REPORTS: 'Standard Reports',
    REPORTS: 'Reports',
    SELECT_A_REPORT: 'Select a report',
    ACCOUNT_SELECTION: 'Account Selection',
    SCHEDULE_REPORT: 'Schedule a report',
    FILTER_BY_DATE_RANGE: 'Filter by date range',
    FILTER_BY_CURRENCY: 'Filter by Currency',
    FILTER_BY_ORDER_TYPE: 'Filter by order type',
    FILTER_PRODUCTS: 'Filter products',
    START_DATE: 'Start date',
    END_DATE: 'End date',
    ADDITIONAL_REPORTING_FIELDS: 'Additional Reporting Fields',
    AVAILABLE_FIELDS: 'Available fields',
    SELECTED_FIELDS: 'Selected Fields to Return',
    SEARCH_FOR_FIELDS: 'Search for fields',
    DRAG_FIELDS: 'Drag fields to reorder',
    SMARTTRACKER: 'SmartTracker',
    SMARTTRACKER_INFO: 'SmartTracker is customs data catpured for our clients during the ordering process to allow for customized record-keeping for each customer. This service can assist a company in tracking and auditing internally to maintain license compliance and other internal reporting functions.',
    DELIVERY_OPTIONS: 'Delivery Options',
    DELIVERY_METHOD: 'Delivery Method',
    DELIVERY_FORMAT: 'Delivery Format',
    DATE_FORMAT: 'Date Format',
    EMAIL_REPORT: 'Email report',
    CUSTOM_NAME: 'Custom name',
    SELECTED_OPERATIONS_CENTER: 'Selected Operations Center(s)',
    SELECTED_REGIONS: 'Selected Region(s)',
    UPDATE: 'Update',
    HIDE_HIERARCHY: 'Hide Hierarchy',
    SHOW_HIERARCHY: 'Show Hierarchy',
    ALL: '*ALL',
    RUN: 'Run',
    NO_RESULTS_FOUND: 'No results found for',
}

// Report Definition Labels
const DELIMITER_LABELS = {
    TAB: 'Tab',
    SEMICOLON: 'Semicolon',
    COMMA: 'Comma',
    SPACE: 'Space'
}

const ACCOUNT_LEVEL_LABELS = {
    ALL_MY_ACCOUNTS: 'All My Accounts',
    REPORTING_PARENT: 'Reporting Parent',
    REPORTING_GRAND_PARENT: 'Reporting Grand Parent',
    GREAT_GRAND_PARENT: 'Great Grand Parent',
    CUSTOM_LIST_OF_SELECTED_ACCOUNT: 'Custom List of Selected Account',
}

export const REPORT_DEFINITION_LABELS = {
    TRACKING_NUMBER: 'Tracking Number',
    REPORT_NAME: 'Report Name',
    INTERVAL: 'Interval',
    ACCUMULATE_RESULTS: 'Accumulate Results',
    FORMAT: 'Format',
    DELIVERY_METHOD: 'Delivery Method',
    DATE_FORMAT: 'Date Format',
    START_DATE: 'Start Date',
    SCHEDULED: 'Scheduled',
    USER_NAME: 'User Name',
    EMAIL: 'Email',
    FTP_LOCATION: 'FTP Location',
    CUSTOM_NAME: 'Custom Name',
    DELIMITERS: 'Delimiters',
    CUSTOMER_NUMBER: 'Customer Number',
    ACCOUNT_LEVEL: 'Account Level',
    ADHOC_COLUMN: 'AdHoc Column',
    SMARTTRACKER: 'SmartTracker',
    CURRENCY: 'Currency',
    ACCOUNTS: 'Accounts',
    MANUFACTURER_FILTER: 'Manufacturer Filter',
    SELECTED_PRODUCT_TYPES: 'Selected Product Types',
    SELECTED_PRODUCT_CATEGORY: 'Selected Product Category',
    SELECTED_PRODUCT_SUBCATEGORY: 'Selected Product Subcategory',
    INSIGHT_PUBLIC_SECTOR_DATA: 'Insight Public Sector Data',
    PARTNER_DATA: 'Partner Data',
    OPERATIONS_CENTER: 'Operations Centers',
    REGION: 'Region',
    UNSAVED_CHANGES: 'You have unsaved changes. Close without saving?',
    ACCOUNT_LEVEL_LABELS,
    DELIMITER_LABELS,
}