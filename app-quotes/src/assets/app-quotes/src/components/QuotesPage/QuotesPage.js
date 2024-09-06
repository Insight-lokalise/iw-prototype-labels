import React, { useReducer, useEffect, useContext, useState, memo } from 'react'
import cn from 'classnames'
import { format } from 'date-fns'

import { l, t } from '@insight/toolkit-utils/lib/labels'
import {
  Button,
  Currency,
  Date as CDate,
  Panel,
  PDPModal,
  ResourceFilters,
  ResourceTable,
  SearchPane,
  Pagination,
} from '@insight/toolkit-react'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import {
  isItemInvalid,
  isQuoteExpired,
  parseDateToISO,
} from '../../lib/helpers'
import QuotesContext from './../../context/QuotesContext'
import {
  convertQuoteToOrder,
  convertQuoteToOrderShoppingReq,
  fetchProductInformation,
  getQuoteHistory,
  getAccountInformation,
  getTop5Quotes,
} from '../../api'
import { parseISOStringForDatePicker } from '@insight/toolkit-utils/lib/helpers/parseISOStringForDatePicker'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'

export const QuotesPage = memo(() => {
  document.title = t('Quote history')
  const [isCES, setIsCES] = useState(false)
  const [webGroupId, setWebGroupId] = useState(null)
  const [quoteResults, setQuoteResults] = useState([])

  const { clear, updateQuery, setAccount, account, isTop5, query } =
    useContext(QuotesContext)

  const initialValues = isTop5
    ? {}
    : {
        query: query?.searchText,
        fromDate: !!query.startDate
          ? parseISOStringForDatePicker(query.startDate)
          : '',
        toDate: !!query.endDate
          ? parseISOStringForDatePicker(query.endDate)
          : '',
      }

  function reducer(state, { type, payload }) {
    switch (type) {
      case 'SET_IS_PDP_MODAL':
        return { ...state, miniPDPMaterialId: payload }
      case 'SET_IS_LOADING':
        return { ...state, isLoading: payload }
      case 'SET_QUOTE_RESPONSE':
        return { ...state, ...payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    quotes: [],
    currentPage: 1,
    totalPages: 1,
    miniPDPMaterialId: false,
    isLoading: true,
  })

  const { quotes, currentPage, totalPages, miniPDPMaterialId, isLoading } =
    state

  useEffect(() => {
    getAccountInformation().then(({ account, isCES, webGroupId }) => {
      setAccount(account)
      setIsCES(isCES)
      setWebGroupId(webGroupId)
      isTop5 && top5QuotesHandler(account)
    })
  }, [])

  useEffect(() => {
    if (!isLoading) window.scrollTo(0, 0)
  }, [isLoading])

  useEffect(() => {
    //only call search when search filters have been changed by user
    if (!isTop5) {
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      getQuoteHistory({ ...query, soldto: account && account.soldToId })
        .then(({ actualQuotes, pagination, quotes: resources }) => {
          setQuoteResults(actualQuotes)
          dispatch({
            type: 'SET_QUOTE_RESPONSE',
            payload: {
              quotes: resources,
              currentPage: pagination.currentPage,
              totalPages: pagination.pageCount,
              isLoading: false,
            },
          })
        })
        .catch(() => {
          dispatch({ type: 'SET_IS_LOADING', payload: false })
        })
    }
  }, [query])

  const isShoppingReqWGEnabled = isCES && window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(query.locale, false, isShoppingReqWGEnabled)

  const top5QuotesHandler = (soldToAccount) => {
    dispatch({ type: 'SET_IS_LOADING', payload: true })
    getTop5Quotes({
      locale: query.locale,
      soldto: soldToAccount && soldToAccount.soldToId,
    })
      .then((top5QuotesData) => {
        const { actualQuotes, pagination, quotes: resources } = top5QuotesData
        setQuoteResults(actualQuotes)
        dispatch({
          type: 'SET_QUOTE_RESPONSE',
          payload: {
            quotes: resources,
            currentPage: pagination.currentPage,
            totalPages: pagination.pageCount,
            isLoading: false,
          },
        })
      })
      .catch(() => {
        dispatch({ type: 'SET_IS_LOADING', payload: false })
      })
  }

  const clearHandler = () => {
    clear()
    top5QuotesHandler(account)
  }

  const openMiniPDP = (materialId) => {
    dispatch({ type: 'SET_IS_PDP_MODAL', payload: materialId })
  }

  const onClose = () => {
    dispatch({ type: 'SET_IS_PDP_MODAL', payload: false })
  }

  const pageHandler = (page) => {
    updateQuery({
      startPage: page,
    })
  }

  const navigateToDetails = (event, id) => {
    event.preventDefault()
    window.open(`quotes/details/${id}`, '_self')
  }

  const viewAllText = (id) => {
    return (
      <Button
        color="link"
        icon="redo"
        iconPosition="right"
        onClick={(event) => navigateToDetails(event, id)}
      >
        {t('View all items in this quote')}
      </Button>
    )
  }

  const retrieveQuotes = (values) => {
    const { query, fromDate, toDate } = values
    updateQuery({
      searchText: query,
      startDate: fromDate ? format(fromDate, 'MM-dd-yyyy') : '',
      endDate: toDate ? format(toDate, 'MM-dd-yyyy') : '',
      startPage: 1,
    })
    dispatch({ type: 'SET_IS_LOADING', payload: true })
  }

  const filters = {
    perPage: {
      id: 'recordsPerPage',
      options: [
        {
          default: true,
          text: t('Display 5 quotes'),
          value: 5,
        },
        {
          text: t('Display 20 quotes'),
          value: 20,
        },
      ],
    },
    sortField: {
      id: 'sortBy',
      options: [
        {
          default: true,
          text: t('Quote date'),
          value: 1,
        },
        {
          text: t('Quote number'),
          value: 2,
        },
        {
          text: t('Quote name'),
          value: 3,
        },
        {
          text: t('Created by'),
          value: 4,
        },
        {
          text: t('Expires'),
          value: 5,
        },
        {
          text: t('Quote total'),
          value: 6,
        },
      ],
    },
    sortDirection: {
      id: 'sortOrder',
      options: [
        {
          id: 'sort_asc',
          label: t('Ascending'),
          name: 'sortOrder',
          value: 0,
          className: 'sort-direction__asc',
        },
        {
          default: true,
          id: 'sort_desc',
          label: t('Descending'),
          name: 'sortOrder',
          value: 1,
          className: 'sort-direction__desc',
        },
      ],
    },
  }
  const labels = [
    {
      id: 'number',
      accessor: 'number',
      label: t('Quote number'),
      render: (row) => (
        <Button
          color="inline-link"
          className="u-text-bold"
          href={`quotes/details/${row.number}`}
          title={t('View quote')}
          onClick={(event) => navigateToDetails(event, row.number)}
        >
          {row.number}
        </Button>
      ),
    },
    {
      id: 'name',
      accessor: 'name',
      className: 'u-1/5@tablet',
      label: t('Quote name'),
    },
    {
      id: 'date',
      accessor: 'date',
      label: t('Quote date'),
      render: (row) => <CDate date={new Date(parseDateToISO(row.date))} />,
    },
    {
      id: 'createdBy',
      accessor: 'createdBy',
      label: t('Created by'),
      render: (row) => <span data-private="true">{row.createdBy}</span>,
    },
    {
      id: 'expires',
      render: (row) => {
        const standardizedExpirationDate = parseDateToISO(row.expires)

        return (
          <div
            className={cn('o-grid__item', {
              'c-resource-table__label-expired': isQuoteExpired(
                standardizedExpirationDate
              ),
            })}
          >
            {isQuoteExpired(standardizedExpirationDate) ? (
              t('Expired')
            ) : (
              <CDate date={standardizedExpirationDate} />
            )}
          </div>
        )
      },
      label: t('Expires'),
    },
    {
      id: 'total',
      label: t('Quote total'),
      render: (row) => (
        <Currency currencyCode={row.currency} value={row.total} />
      ),
    },
    {
      id: 'action',
      render: (row, index) => {
        const isAllItemsInvalid = row.products.every(isItemInvalid)

        const standardizedExpirationDate = parseDateToISO(row.expires)

        const isConvertQuoteDisabled =
          isQuoteExpired(standardizedExpirationDate) ||
          row.isConverted ||
          isAllItemsInvalid

        return (
          <Button
            className={{
              'is-disabled': isQuoteExpired(standardizedExpirationDate),
            }}
            color="primary"
            size="small"
            isDisabled={isConvertQuoteDisabled}
            onClick={() =>
              isShoppingCartEnabled
                ? convertQuoteToOrderShoppingReq(quoteResults[index])
                : convertQuoteToOrder(row.number, row.opportunityId)
            }
          >
            <span>{t('Convert to order')}</span>
          </Button>
        )
      },
    },
  ]

  const filterChangeHandler = (filter) => {
    const { name, value } = filter
    updateQuery({
      [name]: Number(value),
      startPage: name === 'recordsPerPage' ? 1 : currentPage, //reset to 1st page on recordsPerPage change
    })
  }

  //Allow only 3 years prior search
  const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3))

  // modify filters when re-populating  search results, only compute if it is not top 5
  if (!isTop5) {
    updateDefaults(filters.perPage.options, query.recordsPerPage)
    updateDefaults(filters.sortField.options, query.sortBy)
    updateDefaults(filters.sortDirection.options, query.sortOrder)
  }
  return (
    <div className="c-app-quote-history" data-testid="quotes-container">
      <Panel className="c-quote-history--search c-quote-panel">
        <Panel.Body>
          <h1 className="u-h3 u-text-bold">{t('Quotes')}</h1>
          <SearchPane
            datePickerHelperText="Maximum date range is one year"
            searchHelperText="Search by quote name, quote number, or reference number"
            searchTitle="Search quotes"
            onSubmit={retrieveQuotes}
            onClear={clearHandler}
            minDate={minDate}
            initialValues={initialValues}
          />
        </Panel.Body>
      </Panel>
      <Panel className="c-quote-history--search-results c-quote-panel">
        <Panel.Body>
          {!isTop5 && quotes.length > 0 && (
            <ResourceFilters handleChange={filterChangeHandler} {...filters} />
          )}
          {isLoading ? (
            <div className="u-text-center">
              <Loading size={'large'} />
            </div>
          ) : (
            <>
              <ResourceTable
                invalidHandler={isItemInvalid}
                resources={quotes}
                labels={labels}
                openMiniPDP={openMiniPDP}
                viewAllRenderer={viewAllText}
                getCurrencyCode={(row) => row.currency}
              />
              <PDPModal
                showPDP={miniPDPMaterialId ? true : false}
                showBackOrder={true}
                fetchProduct={() =>
                  fetchProductInformation({
                    locale: l(),
                    materialId: miniPDPMaterialId,
                  })
                }
                onClose={onClose}
              />
              {quotes.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageHandler={pageHandler}
                />
              )}
            </>
          )}
        </Panel.Body>
      </Panel>
    </div>
  )
})

const updateDefaults = (options, selectedValue) => {
  return options.map((option) => {
    if (option.value === selectedValue) {
      option.default = true
    } else {
      option.default = false
    }
  })
}

export default QuotesPage
