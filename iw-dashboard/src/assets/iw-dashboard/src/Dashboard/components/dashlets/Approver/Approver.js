import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import TableDashletBody from '../TableDashletBody'

import transformApproverData from './transformApproverData'

export default class Approver extends Component {
  componentDidMount() {
    if (this.props.approverRequisitions === null) {
      this.props.getApproverRequisitions()
    }
  }

  render() {
    const { approverRequisitions, showHeaderLink, title, toggleThisDashlet, tableColumns, transformData } = this.props
    return (
      <Dashlet
        {...(showHeaderLink ? { headerLink: { href: 'ar/reqHistory', text: 'View all' } } : null)}
        title={title}
        toggleThisDashlet={toggleThisDashlet}
      >
        <TableDashletBody
          rawTableData={approverRequisitions}
          tableColumns={tableColumns}
          transformTableData={transformData}
        />
      </Dashlet>
    )
  }
}

Approver.propTypes = {
  approverRequisitions: PropTypes.shape({}),
  getApproverRequisitions: PropTypes.func.isRequired,
  showHeaderLink: PropTypes.bool.isRequired,
  toggleThisDashlet: PropTypes.func,
  // default props
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  transformData: PropTypes.func,
}

Approver.defaultProps = {
  approverRequisitions: null,
  transformData: transformApproverData,
  tableColumns: [
    { priority: 1, name: 'Number', reference: 'referenceNumber', className: 'text-left' },
    { priority: 2, name: 'Requestor', reference: 'requestor', className: 'text-left' },
    { priority: 5, name: 'Creation date', reference: 'creationDate', className: 'text-left' },
    { priority: 6, name: 'Days in your queue', reference: 'daysInQueue', className: 'text-left' },
    { priority: 4, name: 'Account', reference: 'account', className: 'text-left' },
    { priority: 3, name: 'Total', reference: 'total', className: 'text-right' },
    { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
  ],
  title: 'Approver workflow',
  toggleThisDashlet: undefined,
}
