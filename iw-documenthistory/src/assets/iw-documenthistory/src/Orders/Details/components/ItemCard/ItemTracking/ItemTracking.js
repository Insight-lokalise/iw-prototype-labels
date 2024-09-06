import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IWAnchor } from '../../../../../libs/iw-components'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import {INSIGHT_CURRENT_LOCALE_COOKIE_NAME} from "../../../../../constants"

import ItemTrackingHeader from './ItemTrackingHeader'
import ItemTrackingLine from './ItemTrackingLine'

/**
 * Represents the tracking information related to an OrderItem.
 */
export default class ItemTracking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultItemsToShow: 5,
      itemListLength: props.lineItemTrackingInfoList.length,
      showAll: false,
    }
  }

  handleClick = () => {
    this.setState(prevState => ({
      showAll: !prevState.showAll,
      itemsToShow: prevState.showAll ? prevState.defaultItemsToShow : this.state.listLength,
    }))
  }

  render() {
    const { showAll, itemListLength, defaultItemsToShow } = this.state
    const { isAPAC, isEMEA, isLoggedIn, lineItemTrackingInfoList, shippingStatus, orderNumber, salesAreaId } = this.props
    const itemsToShow = showAll ? itemListLength : defaultItemsToShow

    const trackingInfoList = lineItemTrackingInfoList.slice(0, itemsToShow)
    const direction = this.state.showAll ? 'up' : 'down'
    const trackingLink = t('Tracking')
    const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
    const trackingURL = `/${currentLocale}/help/request-tracking-information.html`
    const sortedOrder = lineItemTrackingInfoList.some((item) => item.consignmentNo !== null && item.consignmentNo !== "")
    return (
      <div className="item-tracking">
        {isAPAC ? (
          <div className="row collapse expanded">
            <div className="columns small-12 large-2 item-tracking__label">
              <IWAnchor target="_blank" rel="noopener noreferrer" href={trackingURL} className="orders__link">
                <span className="orders__link-text">{trackingLink}</span>
              </IWAnchor>
            </div>
          </div>
        ) : (
          <div className="row collapse expanded">
            <div className="columns small-6 large-12">
              <ItemTrackingHeader sortedOrder={sortedOrder} isEMEA={isEMEA} />
            </div>
            <div className="columns small-6 large-12">
              {trackingInfoList.map(trackingInfoLine => (
                <ItemTrackingLine
                  key={trackingInfoLine.trackingNumber}
                  isLoggedIn={isLoggedIn}
                  shippingStatus={shippingStatus}
                  isEMEA={isEMEA}
                  trackingInfoLine={trackingInfoLine}
                  orderNumber={orderNumber}
                  salesAreaId={salesAreaId}
                />
              ))}
              {itemListLength > defaultItemsToShow && (
                <IWAnchor
                  className={cn(`ion-chevron-${direction}`, 'hide-for-print')}
                  title={t('View all tracking information')}
                  onClick={this.handleClick}
                >
                  {!showAll && t('View all tracking numbers for this item')}
                </IWAnchor>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

ItemTracking.propTypes = {
  cmsServer: PropTypes.string.isRequired,
  isAPAC: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  lineItemTrackingInfoList: PropTypes.arrayOf(PropTypes.object).isRequired,
  shippingStatus: PropTypes.string.isRequired,
  orderNumber: PropTypes.number.isRequired,
  salesAreaId: PropTypes.number.isRequired,
}
