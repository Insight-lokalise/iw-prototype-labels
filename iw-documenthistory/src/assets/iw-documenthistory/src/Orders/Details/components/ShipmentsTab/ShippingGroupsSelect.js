import React from 'react'
import PropTypes from 'prop-types'
import { IWSelect } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
import { GET_SHIPMENT_OPTIONS } from '../../types'
import { getFormattedDate } from '../ItemCard/ItemTracking/helpers/itemTracking'

export default function ShippingGroupsSelect({ onChange, shipments, showNoShipmentsMessage, value }) {
  const { ALL, SHIPPING_NEXT, NO_SHIPPING_DATE } = GET_SHIPMENT_OPTIONS
  function searchByOptions() {
    const options = [
      { label: t(ALL), value: ALL },
      { label: t(SHIPPING_NEXT), value: SHIPPING_NEXT },
      { label: t(NO_SHIPPING_DATE), value: NO_SHIPPING_DATE },
    ]
    const estShippingDateOptions = shipments.reduce((acc, item) => {
      const optionValue = item.shippingDate ? item.shippingDate : item.estShippingDate
      const date = optionValue ? new Date(optionValue) : ''
      const formattedDate = getFormattedDate(date)
      if (acc.some(option => option.label === formattedDate) || !formattedDate) return acc
      acc.push({ label: formattedDate, value: optionValue })
      return acc
    }, [])
    const sortedDateOptions = estShippingDateOptions.sort(
      (a, b) => (a.value < b.value && -1) || (a.value > b.value && 1) || 0
    )
    return options.concat(sortedDateOptions)
  }
  return (
    <fieldset className="shipping-group hide-for-print">
      <h3 className="shipping-group__heading">{t('Shipments')}</h3>
      <IWSelect
        className="shipping-group__select js-gtm-orders__shipping-group"
        onChange={onChange}
        options={searchByOptions()}
        placeholder={t(ALL)}
        value={value}
        searchable={false}
        clearable={false}
      />
      {showNoShipmentsMessage && (
        <p className="shipping-group__message">
          <span className="orders__ion-icon orders__ion-icon--left ion-alert-circled" />
          {t('No additional shipments found.')}
        </p>
      )}
    </fieldset>
  )
}

ShippingGroupsSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  shipments: PropTypes.arrayOf(
    PropTypes.shape({
      estDeliveryDate: PropTypes.number,
      estShippingDate: PropTypes.number.isRequired,
      shippingMethod: PropTypes.string.isRequired,
      shippingStatus: PropTypes.string.isRequired,
      shipmentItems: PropTypes.arrayOf(
        PropTypes.shape({
          materialInfo: {
            description: PropTypes.string.isRequired,
            imageUrl: PropTypes.string.isRequired,
            qtyShipped: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
          },
          millisecondsEstShippingDate: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  showNoShipmentsMessage: PropTypes.bool,
  value: PropTypes.string.isRequired,
}

ShippingGroupsSelect.defaultProps = {
  showNoShipmentsMessage: false,
}
