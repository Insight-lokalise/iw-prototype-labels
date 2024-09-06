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
  WEB: 5
}

export const PROTECTION_PLANS_HEADING = {
  MANUFACTURER_WARRANTIES: 'Manufacturer Warranties', 
  OTHER_PROTECTION_PLANS: 'Other protection plans'
}

export const PROTECTION_PLANS_TEXTS = {
  NO_PROTECTION_PLANS_FOUND: 'No protection plans found',
  VIEW_LESS_PROTECTION_PLANS: 'View less protection plans',
  VIEW_MORE_PROTECTION_PLANS: 'View more protection plans',
}