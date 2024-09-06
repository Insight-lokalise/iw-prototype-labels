import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ShipmentCard from '../../components/ShipmentCard/ShipmentCard'
import { GET_SHIPMENT_OPTIONS } from '../../types'
import ShippingGroupsSelect from './ShippingGroupsSelect'

export default class ShipmentsTabView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredShipments: props.shipments,
      shipments: props.shipments,
      showNoShipmentsMessage: false,
      value: GET_SHIPMENT_OPTIONS.ALL,
    }
  }

  onChange = (selected)=> {
    let filteredShipments
    const { value } = selected
    const { shipments } = this.state
    const { ALL, NO_SHIPPING_DATE, SHIPPING_NEXT } = GET_SHIPMENT_OPTIONS

    switch (value) {
      case ALL:
        filteredShipments = shipments
        break
      case NO_SHIPPING_DATE:
        filteredShipments = shipments.filter(item => !item.estShippingDate && !item.shippingDate)
        break
      case SHIPPING_NEXT:
        filteredShipments = shipments.filter(item => {
          const deliveryDate = item.estDeliveryDate ? item.estDeliveryDate : item.actualDeliveryDate
          return !deliveryDate || deliveryDate > +new Date()
        })
        break

      default:
        filteredShipments = shipments.filter(item => {
          const date = item.shippingDate || item.estShippingDate
          return date === value
        })
        break
    }
    this.setState({
      filteredShipments,
      showNoShipmentsMessage: filteredShipments.length === 0,
      value,
    })
  }

  render() {
    return (
      <div>
        <ShippingGroupsSelect
          onChange={this.onChange}
          shipments={this.props.shipments}
          showNoShipmentsMessage={this.state.showNoShipmentsMessage}
          value={this.state.value}
        />
        {this.state.filteredShipments.map(shipment => {
          const materialIdsStr = shipment.shipmentItems.map(item => item.materialInfo.materialId).join('-')
          const shipmentsLength = shipment.shipmentItems.length
          const key = `${shipmentsLength}-${materialIdsStr}-${shipment.estDeliveryDate}`
          return <ShipmentCard key={key} shipment={shipment} isEMEA={this.props.isEMEA} />
        })}
      </div>
    )
  }
}

ShipmentsTabView.propTypes = {
  shipments: PropTypes.arrayOf(
    PropTypes.shape({
      estDeliveryDate: PropTypes.number.isRequired,
      estShippingDate: PropTypes.number.isRequired,
      shippingMethod: PropTypes.string.isRequired,
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
    })
  ).isRequired,
  isEMEA: PropTypes.bool.isRequired
}
