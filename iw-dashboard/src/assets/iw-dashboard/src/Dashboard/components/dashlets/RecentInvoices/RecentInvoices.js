import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import TableDashletBody from '../TableDashletBody'

import transformInvoiceData from './transformInvoiceData'

export default class RecentInvoices extends Component {
  componentDidMount() {
    if (this.props.recentInvoicesData === null) {
      this.props.getRecentInvoices()
    }
  }

  render() {
    const { isCES } = this.props
    return (
      <Dashlet
        headerLink={{ href: isCES ? 'invoices' : 'invoiceHistory', text: 'View all' }}
        title={this.props.title}
        toggleThisDashlet={this.props.toggleThisDashlet}
      >
        <TableDashletBody
          rawTableData={this.props.recentInvoicesData}
          tableColumns={this.props.tableColumns}
          transformTableData={this.props.transformData}
          isCES={isCES}
        />
      </Dashlet>
    )
  }
}

RecentInvoices.propTypes = {
  getRecentInvoices: PropTypes.func.isRequired,
  recentInvoicesData: PropTypes.arrayOf(PropTypes.object),
  toggleThisDashlet: PropTypes.func,
  // default props
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  transformData: PropTypes.func,
  isCES: PropTypes.bool.isRequired,
}

RecentInvoices.defaultProps = {
  recentInvoicesData: undefined,
  transformData: transformInvoiceData,
  tableColumns: [
    { priority: 1, name: 'Number', reference: 'invoiceNumber', className: 'text-left' },
    { priority: 1, name: 'Invoice date', reference: 'createDate', className: 'text-left' },
    { priority: 3, name: 'PO number', reference: 'poNumber', className: 'text-left' },
    { priority: 4, name: 'Account', reference: 'soldto', className: 'text-left' },
    { priority: 2, name: 'Total', reference: 'value', className: 'text-right' },
  ],
  title: 'Recent invoices',
  toggleThisDashlet: undefined,
}
