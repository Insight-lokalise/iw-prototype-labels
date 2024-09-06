import React, { useReducer, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { l, t } from '@insight/toolkit-utils/lib/labels'
import {
  Button,
  Currency,
  Date,
  Panel,
  PDPModal,
  ResourceFilters,
  ResourceTable,
  SearchPane,
  Pagination,
} from '@insight/toolkit-react'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import format from 'date-fns/format'
import {
  fetchProductInformation,
  getAccountInformation,
  getInvoiceHistory,
} from '../../api'
import InvoiceContext from './../../context/InvoiceContext'
import { parseISOStringForDatePicker } from '@insight/toolkit-utils/lib/helpers/parseISOStringForDatePicker'

export const InvoicesPage = () => {
  document.title = t('Invoice history')
  const { clear, updateQuery, query, isInit } = useContext(InvoiceContext)

  const history = useHistory()

  function reducer(state, { type, payload }) {
    switch (type) {
      case 'SET_IS_PDP_MODAL':
        return { ...state, miniPDPMaterialId: payload }
      case 'SET_IS_LOADING':
        return { ...state, isLoading: payload }
      case 'SET_INVOICE_RESPONSE':
        return { ...state, ...payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    invoices: [],
    currentPage: 1,
    totalPages: 1,
    miniPDPMaterialId: false,
    isLoading: true,
  })

  const { invoices, currentPage, totalPages, miniPDPMaterialId, isLoading } =
    state

  const initialValues = isInit
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

  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', payload: true })
    getAccountInformation().then(({ account }) => {
      getInvoiceHistory({ ...query, soldto: account && account.soldToId })
        .then(({ pagination, invoices: resources }) => {
          dispatch({
            type: 'SET_INVOICE_RESPONSE',
            payload: {
              invoices: resources,
              currentPage: pagination.currentPage,
              totalPages: pagination.pageCount,
              isLoading: false,
            },
          })
        })
        .catch(() => {
          dispatch({ type: 'SET_IS_LOADING', payload: false })
        })
    })
  }, [query])

  useEffect(() => {
    if (!isLoading) window.scrollTo(0, 0)
  }, [isLoading])

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
    window.open(`invoices/${id}`, "_self");
  }

  const viewAllText = (id) => (
    <Button
      color="link"
      icon="redo"
      iconPosition="right"
      onClick={(event) => navigateToDetails(event, id)}
    >
      {t('View all items in this invoice')}
    </Button>
  )

  const retriveInvoices = (values) => {
    const { query, fromDate, toDate } = values
    updateQuery({
      searchText: query,
      startDate: fromDate ? format(fromDate, 'MM-dd-yyyy') : '',
      endDate: toDate ? format(toDate, 'MM-dd-yyyy') : '',
    })
    dispatch({ type: 'SET_IS_LOADING', payload: true })
  }

  const clearHandler = () => {
    clear()
  }

  const labels = [
    {
      id: 'number',
      accessor: 'number',
      label: t('Invoice number'),
      render: (row) => (
        <Button
          color="inline-link"
          className="u-text-bold"
          href={`invoices/${row.number}`}
          title={t('View invoice')}
          onClick={(event) => navigateToDetails(event, row.number)}
        >
          {row.number}
        </Button>
      ),
    },
    {
      id: 'date',
      accessor: 'date',
      label: t('Invoice date'),
      render: (row) => <Date date={row.date} />,
    },
    {
      id: 'poRelease',
      render: (row) => <div>{`${row.po} / ${row.poRelease}`}</div>,
      accessor: 'poRelease',
      label: t('PO / PO release'),
    },
    {
      id: 'total',
      label: t('Invoice total'),
      render: (row) => <Currency currencyCode={row.currency} value={row.total} />,
    },
    {
      id: 'status',
      accessor: 'status',
      render: (row) => <div>{row.status}</div>,
      label: t('Invoice status'),
    },
    {
      id: 'orderNumber',
      accessor: 'orderNumber',
      render: (row) => <div>{row.orderNumber}</div>,
      label: t('Order number'),
    },
    {
      id: 'AccounNameAndNumber',
      render: (row) => <div>{`${row.accountName} / ${row.accountNumber}`}</div>,
      label: t('Account name / number'),
    },
  ]

  const filters = {
    perPage: {
      id: 'recordsPerPage',
      options: [
        {
          default: true,
          text: t('Display 5 invoices'),
          value: 5,
        },
        {
          text: t('Display 20 invoices'),
          value: 20,
        },
      ],
    },
    sortField: {
      id: 'sortBy',
      options: [
        {
          default: true,
          text: t('Invoice date'),
          value: 1,
        },
        {
          text: t('Invoice number'),
          value: 2,
        },
        {
          text: t('Invoice status'),
          value: 3,
        },
        {
          text: t('Invoice total'),
          value: 4,
        }
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
  };

  const filterChangeHandler = (filter) => {
    const { name, value } = filter
    updateQuery({
      [name]: Number(value),
      startPage: name === 'recordsPerPage' ? 1 : currentPage, //reset to 1st page on recordsPerPage change
    })
  }

  updateDefaults(filters.perPage.options, query.recordsPerPage)
  updateDefaults(filters.sortField.options, query.sortBy)
  updateDefaults(filters.sortDirection.options, query.sortOrder)
  return (
    <div
      className="c-app-invoice-history c-container"
      data-testid="invoices-container"
    >
      <Panel className="c-app-invoice-history__panel c-app-invoice-history__panel-search">
        <Panel.Body>
          <h1 className="u-h3 u-text-bold">{t('Invoices')}</h1>
          <SearchPane
            datePickerHelperText="Maximum date range is one year"
            searchHelperText="Search by invoice number, order number, PO number, asset tag, or serial number"
            searchTitle="Search invoices"
            onSubmit={retriveInvoices}
            onClear={clearHandler}
            initialValues={initialValues}
          />
        </Panel.Body>
      </Panel>
      <Panel className="c-app-invoice-history__panel">
        <Panel.Body>
          {invoices.length > 0 && (
            <ResourceFilters handleChange={filterChangeHandler} {...filters} />
          )}
          {isLoading ? (
            <div className="u-text-center">
              <Loading size={'large'} />
            </div>
          ) : (
            <>
              <ResourceTable
                resources={invoices}
                labels={labels}
                openMiniPDP={openMiniPDP}
                viewAllRenderer={viewAllText}
                isInitiallyExpanded={false}
              />
              <PDPModal
                showPDP={miniPDPMaterialId ? true : false}
                fetchProduct={() =>
                  fetchProductInformation({
                    locale: l(),
                    materialId: miniPDPMaterialId,
                  })
                }
                onClose={onClose}
              />
              {invoices.length > 0 && (
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
}

const updateDefaults = (options, selectedValue) => {
  return options.map((option) => {
    if (option.value === selectedValue) {
      option.default = true
    } else {
      option.default = false
    }
  })
}

export default InvoicesPage
