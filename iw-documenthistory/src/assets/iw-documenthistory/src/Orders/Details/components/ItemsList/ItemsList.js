import React from 'react'
import PropTypes from 'prop-types'

import ItemCard from './../ItemCard/ItemCard'

/**
 * Wrapper for the list of items in an order.
 * @param { Array } orderDetails.
 * @param { String } userSessionType
 * @param { Object } contractsIdsNamesMap. Existing contracts to map names from.
 */
export default function ItemsList({
  cmsServer,
  currencyCode,
  hasInvoicingEnabled,
  isLoggedIn,
  isAPAC,
  isEMEA,
  orderDetails,
  orderNumber,
  getDEPInfo,
  salesAreaId
}) {
  // render only parent items without enrollment prop (only child items have enrollment prop)
  const parentItems = orderDetails.reduce((acc, item) => {
    if (item.data && item.type === 'item' && item.data.enrollment) return acc
    return acc.concat(item)
  }, [])

  return (
    <div className="items-list">
      {parentItems.map(item => (
        <ItemCard
          cmsServer={cmsServer}
          currencyCode={currencyCode}
          hasInvoicingEnabled={hasInvoicingEnabled}
          isAPAC={isAPAC}
          isEMEA={isEMEA}
          isLoggedIn={isLoggedIn}
          item={item}
          key={item.id}
          orderNumber={orderNumber}
          getDEPInfo={getDEPInfo}
          salesAreaId={salesAreaId}
        />
      ))}
    </div>
  )
}

ItemsList.propTypes = {
  cmsServer: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  isAPAC: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  orderDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
  orderNumber: PropTypes.number.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
  salesAreaId: PropTypes.number.isRequired,
}
