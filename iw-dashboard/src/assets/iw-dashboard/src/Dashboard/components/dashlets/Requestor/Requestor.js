import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import TableDashletBody from '../TableDashletBody'

import transformRequestorData from './transformRequestorData'

export default class Requestor extends Component {
  componentDidMount() {
    if (this.props.requestorRequisitions === null) {
      this.props.getRequestorRequisitions()
    }
  }

  render() {
    return (
      <Dashlet
        {...(this.props.showHeaderLink ? { headerLink: { href: 'ar/reqHistory', text: 'View all' } } : null)}
        title={this.props.title}
        toggleThisDashlet={this.props.toggleThisDashlet}
      >
        <TableDashletBody
          rawTableData={this.props.requestorRequisitions}
          tableColumns={this.props.tableColumns}
          transformTableData={this.props.transformData}
        />
      </Dashlet>
    )
  }
}

Requestor.propTypes = {
  getRequestorRequisitions: PropTypes.func.isRequired,
  requestorRequisitions: PropTypes.object,
  showHeaderLink: PropTypes.bool.isRequired,
  toggleThisDashlet: PropTypes.func,
  // default props
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  transformData: PropTypes.func,
}

Requestor.defaultProps = {
  requestorRequisitions: undefined,
  transformData: transformRequestorData,
  tableColumns: [
    { priority: 1, name: 'Number', reference: 'referenceNumber', className: 'text-left' },
    { priority: 2, name: 'Approver', reference: 'approver', className: 'text-left' },
    { priority: 5, name: 'Creation date', reference: 'creationDate', className: 'text-left' },
    {
      priority: 6,
      name: 'Days waiting for approval',
      reference: 'daysWaitingForApproval',
      className: 'text-left',
    },
    { priority: 4, name: 'Account', reference: 'account', className: 'text-left' },
    { priority: 3, name: 'Total', reference: 'total', className: 'text-right' },
    { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
  ],
  title: 'Requestor workflow',
  toggleThisDashlet: undefined,
}
