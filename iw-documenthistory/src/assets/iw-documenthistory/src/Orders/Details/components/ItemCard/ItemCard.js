import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import CardType from './CardType'

// Represents one entry, an item, bundle or contract, in the list of items in the details tab.
export default function ItemCard({
  cmsServer,
  currencyCode,
  hasInvoicingEnabled,
  isAPAC,
  isEMEA,
  isLoggedIn,
  item,
  orderNumber,
  getDEPInfo,
  salesAreaId
}) {
  const { data, type } = item

  return (
    <div className={cn('item-card', `item-card--${type}`)} key={data.id}>
      <CardType
        cmsServer={cmsServer}
        currencyCode={currencyCode}
        currentPart={item}
        hasInvoicingEnabled={hasInvoicingEnabled}
        isAPAC={isAPAC}
        isEMEA={isEMEA}
        isLoggedIn={isLoggedIn}
        itemType={type}
        orderNumber={orderNumber}
        getDEPInfo={getDEPInfo}
        salesAreaId={salesAreaId}
      />
    </div>
  )
}

ItemCard.propTypes = {
  cmsServer: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  isAPAC: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  orderNumber: PropTypes.number.isRequired,
  salesAreaId: PropTypes.number.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
}
