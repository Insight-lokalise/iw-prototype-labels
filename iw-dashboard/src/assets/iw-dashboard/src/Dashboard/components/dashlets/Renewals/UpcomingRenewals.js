import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import TableDashletBody from '../TableDashletBody'
import transformTableData from './transformUpcomingRenewalsData'
import { fetchRenewalsURL } from '../../../../services'

export default class UpcomingRenewals extends Component {
  componentDidMount() {
    if (!this.props.hasData) {
      this.props.getData()
    }
  }

  render() {
    const { data, tableColumns } = this.props
    return (
      <Dashlet
        headerLink={{ linkFunction: () => redirect(), text: 'View All' }}
        title={this.props.title}
        toggleThisDashlet={this.props.toggleThisDashlet}
      >
        <TableDashletBody rawTableData={data} tableColumns={tableColumns} transformTableData={transformTableData} />
      </Dashlet>
    )
  }
}

UpcomingRenewals.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      clientPo: PropTypes.string.isRequired,
      expiryDays: PropTypes.number.isRequired,
      manufacturer: PropTypes.string.isRequired,
      prevOrderNo: PropTypes.number.isRequired,
      renewalEndDate: PropTypes.string.isRequired,
      renewalQuoteNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      soldTo: PropTypes.number.isRequired,
    })
  ),
  getData: PropTypes.func.isRequired,
  hasData: PropTypes.bool.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  toggleThisDashlet: PropTypes.func,
}

UpcomingRenewals.defaultProps = {
  data: undefined,
  tableColumns: [
    { priority: 6, name: 'Days remaining', reference: 'expiryDays', className: 'text-left' },
    { priority: 1, name: 'Renewal date', reference: 'renewalEndDate', className: 'text-left' },
    { priority: 4, name: 'Previous order #', reference: 'prevOrderNo', className: 'text-left' },
    { priority: 5, name: 'PO #', reference: 'clientPo', className: 'text-left' },
    { priority: 3, name: 'Renewal quote #', reference: 'renewalQuoteNo', className: 'text-left' },
    { priority: 2, name: 'Manufacturer', reference: 'manufacturer', className: 'text-left' },
  ],
  title: 'Upcoming Renewals',
  toggleThisDashlet: undefined,
}

// TODO: Verify when API is fully functional
function redirect() {
  fetchRenewalsURL().then(response => {
    window.location.assign(response.data)
  })
}
