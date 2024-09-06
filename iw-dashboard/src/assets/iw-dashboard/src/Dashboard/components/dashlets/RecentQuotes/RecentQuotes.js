import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import TableDashletBody from '../TableDashletBody'

import transformQuoteData from './transformQuoteData'

export default class RecentQuotes extends Component {
  componentDidMount() {
    if (this.props.recentQuotesData === null) {
      this.props.getRecentQuotes()
    }
  }

  render() {
    const { isCES } = this.props
    return (
      <Dashlet
        headerLink={{ href: isCES ? 'quotes' : 'quoteHistory', text: 'View all' }}
        title={'Recent quotes'}
        toggleThisDashlet={this.props.toggleThisDashlet}
      >
        <TableDashletBody
          rawTableData={this.props.recentQuotesData}
          tableColumns={this.props.tableColumns}
          transformTableData={this.props.transformData}
          isCES={isCES}
        />
      </Dashlet>
    )
  }
}

RecentQuotes.propTypes = {
  getRecentQuotes: PropTypes.func.isRequired,
  recentQuotesData: PropTypes.arrayOf(PropTypes.object),
  toggleThisDashlet: PropTypes.func,
  // default props
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  transformData: PropTypes.func,
  isCES: PropTypes.bool.isRequired,
}

RecentQuotes.defaultProps = {
  recentQuotesData: undefined,
  transformData: transformQuoteData,
  tableColumns: [
    { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
    { priority: 4, name: 'Name', reference: 'quoteName', className: 'text-left' },
    { priority: 4, name: 'Reference number', reference: 'referenceNumber', className: 'text-left' },
    { priority: 3, name: 'Placed by', reference: 'placedBy', className: 'text-left' },
    { priority: 1, name: 'Date', reference: 'createDate', className: 'text-left' },
    { priority: 2, name: 'Total', reference: 'value', className: 'text-right' },
  ],
  title: 'Recent quotes',
  toggleThisDashlet: undefined,
}
