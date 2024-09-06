import React from 'react'
import PropTypes from 'prop-types'
import ShipmentCardHeader from './ShipmentCardHeader'
import ShipmentCardBody from './ShipmentCardBody'

export default function ShipmentCard({ shipment, isEMEA }) {
  return (
    <div className="shipment-card">
      <ShipmentCardHeader shipment={shipment} isEMEA={isEMEA} />
      <ShipmentCardBody shipment={shipment} />
    </div>
  )
}

ShipmentCard.propTypes = {
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
  isEMEA: PropTypes.bool.isRequired
}
