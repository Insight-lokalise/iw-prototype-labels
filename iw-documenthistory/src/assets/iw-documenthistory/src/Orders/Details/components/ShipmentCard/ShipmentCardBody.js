import React from 'react'
import PropTypes from 'prop-types'
import LineItem from './LineItem'

export default function ShipmentCardBody({ shipment }) {
  const { shipmentItems } = shipment
  return (
    <div className="shipment-card-body">
      {shipmentItems.map(item => (
        <LineItem item={item} key={`${item.estDeliveryDate}-${item.estShippingDate}-${item.materialInfo.materialId}`} />
      ))}
    </div>
  )
}

ShipmentCardBody.propTypes = {
  shipment: PropTypes.shape({
    estDeliveryDate: PropTypes.number.isRequired,
    estShippingDate: PropTypes.number.isRequired,
    shippingMethod: PropTypes.string,
    shippingStatus: PropTypes.string.isRequired,
    shipmentItems: PropTypes.arrayOf(
      PropTypes.shape({
        materialInfo: {
          description: PropTypes.string.isRequired,
          imageUrl: PropTypes.string,
          qtyShipped: PropTypes.number.isRequired,
          quantity: PropTypes.number.isRequired,
        },
        millisecondsEstShippingDate: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}
