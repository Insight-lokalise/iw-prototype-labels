import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import TableDashletBody from '../TableDashletBody'

import transformOrderData from './transformOrderData'

export default class RecentOrders extends Component {
  componentDidMount() {
    if (this.props.recentOrdersData === null) {
      this.props.getRecentOrders()
    }
  }

  render() {
    return (
      <Dashlet
        headerLink={{ href: 'orderHistory', text: 'View all' }}
        title={this.props.title}
        toggleThisDashlet={this.props.toggleThisDashlet}
      >
        <TableDashletBody
          rawTableData={this.props.recentOrdersData}
          tableColumns={this.props.tableColumns}
          transformTableData={this.props.transformData}
        />
      </Dashlet>
    )
  }
}

RecentOrders.propTypes = {
  getRecentOrders: PropTypes.func.isRequired,
  recentOrdersData: PropTypes.arrayOf(PropTypes.object),
  toggleThisDashlet: PropTypes.func,
  // default props
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  transformData: PropTypes.func,
}

RecentOrders.defaultProps = {
  recentOrdersData: undefined,
  transformData: transformOrderData,
  tableColumns: [
    { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
    { priority: 1, name: 'Status', reference: 'status', className: 'text-left' },
    { priority: 5, name: 'Placed by', reference: 'placedBy', className: 'text-left' },
    { priority: 3, name: 'Date', reference: 'createDate', className: 'text-left' },
    { priority: 7, name: 'PO #', reference: 'poNumber', className: 'text-left' },
    { priority: 6, name: 'Reference number', reference: 'referenceNumber', className: 'text-left' },
    { priority: 2, name: 'Total', reference: 'value', className: 'text-right' },
  ],
  title: 'Recent orders',
  toggleThisDashlet: undefined,
}
