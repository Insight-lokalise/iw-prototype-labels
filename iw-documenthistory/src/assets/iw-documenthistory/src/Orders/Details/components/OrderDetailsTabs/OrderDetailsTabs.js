import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import Tabs from '../Tabs/Tabs'
import TabContainer from '../TabContainer/TabContainer'
import OrderDetailsTab from './../../containers/OrderDetailsTab/OrderDetailsTab'
import CustomerDetailsTab from '../../containers/CustomerDetailsTab/CustomerDetailsTab'
import ShipmentsTab from '../../containers/ShipmentsTab/ShipmentsTab'

/**
 * Renders all the tabs inside the Tab component
 * and the respective content
 */
export default function OrderDetailsTabs({ hasShippableItems, isLoggedIn }) {
  return (
    <div className="row expanded small-collapse medium-uncollapse orders__container orders__container--tabs print__display--block order__details order__details--ces">
      <div className="column">
        <Tabs defaultActiveKey={0}>
          <TabContainer label={t('Order details')}>
            <OrderDetailsTab isLoggedIn={isLoggedIn} />
          </TabContainer>
          {hasShippableItems && (
            <TabContainer label={t('Shipments')}>
              <ShipmentsTab />
            </TabContainer>
          )}
          {isLoggedIn && (
            <TabContainer label={t('Customer details')}>
              <CustomerDetailsTab isLoggedIn={isLoggedIn} />
            </TabContainer>
          )}
        </Tabs>
      </div>
    </div>
  )
}

OrderDetailsTabs.propTypes = {
  hasShippableItems: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
