import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { IWLoading, IWResponsiveTable, RTRow } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

import { selector_genericSearchResults } from '../../selectors/genericSearchResults'
import OrderCard from '../../../../Shared/components/OrderCard/OrderCard'

function GenericSearchResults(props) {
  const tableColumns = [
    { priority: 1, name: t('Order number'), reference: 'orderNumber', className: 'text-left' },
    { priority: 6, name: t('Order status'), reference: 'orderStatus', className: 'text-center' },
    { priority: 6, name: t('Order date'), reference: 'orderDate', className: 'text-left' },
    { priority: 6, name: t('PO / PO release #'), reference: 'po', className: 'text-left' },
    { priority: 6, name: t('Reference number'), reference: 'webReferenceNumber', className: 'text-left' },
    { priority: 6, name: t('Shipping city'), reference: 'shipToCity', className: 'text-left' },
    { priority: 6, name: t('Order total'), reference: 'orderTotal', className: 'text-right' },
    { priority: 6, name: '', reference: 'placeHolder', className: 'text-right' },
  ]
  const noResults = t('No results found')
  const { isLoading, isLoggedIn } = props
  return (
    <div className="search-results">
      {isLoading ? (
        <div className="text-center">
          <IWLoading />
        </div>
      ) : (
        props.orders.orders &&
        (props.orders.orders.length > 0 ? (
          <div>
            <IWResponsiveTable tableColumns={tableColumns}>
              {props.orders.orders.map((rowData, index) => (
                <RTRow
                  key={rowData.header.orderNumber}
                  render={props => <OrderCard index={index} isLoggedIn={isLoggedIn} rowData={rowData} {...props} />}
                />
              ))}
            </IWResponsiveTable>
            {/* TODO - pagination in next release */}
          </div>
        ) : (
          <p className="no-margin-bot">{noResults}</p>
        ))
      )}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    orders: selector_genericSearchResults(state),
  }
}

GenericSearchResults.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  orders: PropTypes.shape({
    // Key value pair
    orders: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
}

export default connect(mapStateToProps)(GenericSearchResults)
