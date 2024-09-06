import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import ReportUsage from '../../libs/businessContainerApps/reportUsage/ReportUsage'
import CartSummary from '../../libs/businessContainerApps/cartSummary/CartSummary'
import CartSummarySimple from '../../libs/businessContainerApps/cartSummarySimple/CartSummarySimple'
import AddressSection from './containers/AddressSection/AddressSectionWrapper'
import ShippingOptions from './containers/ShippingOptions/ShippingOptionsWrapper'
import PaymentInfo from './containers/PaymentInfo/PaymentInfoWrapper'
import SBPHeader from './components/SBPHeader/SBPHeader'

import { IWAccordion } from './../../libs/iw-components'

export function ShipBillPay({ history, context }) {
  // @todo remove disable_feature_payment after pack one is merged with develop
  const disable_feature_payment = false
  const isCES = context && context.isCES

  const renderCartSummary = () => {
    return !isCES ? (
      <CartSummary hideEWR />
    ) : (
      <CartSummarySimple hideEWR showSaveForLater />
    )
  }

  return (
    <div className="shipbillpay-wrapper">
      <div className="row expanded small-collapse large-uncollapse">
        <div className="column">
          <SBPHeader />
          <ReportUsage />
        </div>
      </div>
      <div className="row expanded small-collapse large-uncollapse">
        <div className="columns small-12 large-9 print-12">
          <div className="hide-for-medium">{renderCartSummary()}</div>
          <IWAccordion name="SBP" initialActiveIndex={0}>
            <AddressSection history={history} type="shipping" isCES={isCES} />
            <ShippingOptions history={history} />
            <AddressSection history={history} type="billing" isCES={isCES} />
            {disable_feature_payment && (
              <PaymentInfo history={history} disable_feature_payment />
            )}
          </IWAccordion>
        </div>
        <div className="columns small-12 large-3 print-5 print-offset-7">
          <div
            className={
              'hide-for-small-only sticky-summary top-space-small ' +
              cn({
                'top-space-large': !isCES,
              })
            }
          >
            {renderCartSummary()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default connectToLocale(ShipBillPay)

ShipBillPay.propTypes = {
  history: PropTypes.object.isRequired,
}
