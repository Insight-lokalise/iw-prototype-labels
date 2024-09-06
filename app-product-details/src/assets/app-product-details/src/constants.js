export const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = 'insight_current_locale'

export const REVIEW_SORT_OPTIONS = [
  {
    value: 'SubmissionTime:desc,Rating:desc',
    text: 'Most recent',
    id: 'Most recent',
  },
  { value: 'SubmissionTime:asc,Rating:asc', text: 'Oldest', id: 'Oldest' },
  {
    value: 'TotalPositiveFeedbackCount:desc,Rating:desc',
    text: 'Most helpful',
    id: 'Most helpful',
  },
  {
    value: 'TotalNegativeFeedbackCount:desc,Rating:asc',
    text: 'Least helpful',
    id: 'Least helpful',
  },
  { value: 'Rating:desc', text: 'Most favorable', id: 'Most favorable' },
  { value: 'Rating:asc', text: 'Least favorable', id: 'Least favorable' },
]

export const VARIANT_LIMIT = 5

export const DEFAULT_LIMITS = {
  MOBILE: 3,
  WEB: 5,
}

export const ADD_TO_CART_CATEGORY_TYPES = {
  MAIN_ADD_TO_CART: 'Main Add to Cart',
  PROTECTION_PLANS: 'Protection Plans',
  ACCESSORIES: 'Accessories',
  COMPARE_SIMILAR: 'Compare Similar',
  BETTER_TOGETHER: 'Better Together',
}

export const PROTECTION_PLANS_HEADING = {
  MANUFACTURER_WARRANTIES: 'Manufacturer Warranties',
  OTHER_PROTECTION_PLANS: 'Other protection plans',
}

export const PROTECTION_PLANS_TEXTS = {
  NO_PROTECTION_PLANS_FOUND: 'No protection plans found',
  VIEW_LESS_PROTECTION_PLANS: 'View less protection plans',
  VIEW_MORE_PROTECTION_PLANS: 'View more protection plans',
}

export const IPS_CONTRACT_ID_COOKIE_NAME = 'ips-contract-id'
export const IPS_CONTRACT_NAME_COOKIE_NAME = 'ips-contract-name'
export const OPEN_MARKET = 'Open Market'
export const ALL = 'All'
export const CONTRACT_OPEN_MARKET = {
  displayName: OPEN_MARKET,
  contractName: OPEN_MARKET,
  contractId: null,
  contractType: null,
}

export const CONTRACT_LOADING_MESSAGE = "Loading contracts and prices"
export const CONTRACT_TIMED_OUT_MESSAGE = "Unable to load contract prices. Visit the product page for details"
export const CALL_FOR_PRICE = "Contact us for Pricing"
export const CONTRACT_NO_PRICE_MESSAGE = "Visit the product page for details"
