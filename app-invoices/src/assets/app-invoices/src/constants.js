import format from "date-fns/format";

export const PAGE_ROUTE = {
  INVOICE_HISTORY: '/invoices',
  INVOICE_DETAIL: '/invoices/:id',
}

export const ROUTES = {
  INVOICE_HISTORY: {
    url: PAGE_ROUTE.INVOICE_HISTORY,
    name: 'Invoices',
  },
  INVOICE_DETAIL: {
    url: PAGE_ROUTE.INVOICE_DETAIL,
    name: 'Invoice details',
  },
}

export const BREADCRUMBS = {
  INVOICE_HISTORY: [ROUTES.INVOICE_HISTORY],
  INVOICE_DETAIL: [ROUTES.INVOICE_HISTORY, ROUTES.INVOICE_DETAIL],
}

export const displayNameMap = {
  PCN_NO: 'PCN #',
  LICENSE: 'License #',
  INITIAL_STK_NO: 'Initial stock #',
}

export const startDate = format(new Date(new Date().setDate(new Date().getDate() - 15)), 'MM-dd-yyyy')
export const endDate= format(new Date(), 'MM-dd-yyyy')
