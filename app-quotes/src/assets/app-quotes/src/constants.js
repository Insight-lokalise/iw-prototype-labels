
export const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = 'insight_current_locale'
export const PHONE_NUMBER_PATTERN = '[0-9]{3}-[0-9]{3}-[0-9]{4}'

export const PAGE_ROUTE = {
  QUOTE_HISTORY: '/quotes',
  QUOTE_DETAIL: '/quotes/details/:id',
  SAVE_QUOTE: '/quotes/save',
  SAVE_QUOTE_CONFIRM: '/quotes/save/confirm',
}

export const ROUTES = {
  QUOTE_HISTORY: {
    url: PAGE_ROUTE.QUOTE_HISTORY,
    name: 'Quotes',
  },
  QUOTE_DETAIL: {
    url: PAGE_ROUTE.QUOTE_DETAIL,
    name: 'Quote details',
  },
  SAVE_QUOTE: {
    url: PAGE_ROUTE.SAVE_QUOTE,
    name: 'Save as quote',
  },
  SAVE_QUOTE_CONFIRM: {
    url: PAGE_ROUTE.SAVE_QUOTE_CONFIRM,
    name: 'Quote Saved',
  },
}

export const BREADCRUMBS = {
  QUOTE_HISTORY: [ROUTES.QUOTE_HISTORY],
  QUOTE_DETAIL: [ROUTES.QUOTE_HISTORY, ROUTES.QUOTE_DETAIL],
  SAVE_QUOTE: [ROUTES.SAVE_QUOTE],
  SAVE_QUOTE_CONFIRM: [ROUTES.SAVE_QUOTE],
}

export const displayNameMap = {
  PCN_NO: 'PCN #',
  LICENSE: 'License #',
  INITIAL_STK_NO: 'Initial stock #',
}

