import React from 'react'

import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import cn from 'classnames'
import ReportUsage from '../../libs/businessContainerApps/reportUsage/ReportUsage'
import CartSummary from '../../libs/businessContainerApps/cartSummary/CartSummary'
import CartSummarySimple from '../../libs/businessContainerApps/cartSummarySimple/CartSummarySimple'
import SaveForLater from '../../libs/businessContainerApps/saveForLater/SaveForLater'
import { IWAccordion } from '../../libs/iw-components/iw-accordion'

import AdditionalInformationAccordion from './components/AdditionalInfo/AdditionalInfoAccordion'
import LineLevelInfoAccordion from './components/LineLevelInfo/LineLevelInfoAccordion'

export function LineLevel(props) {
  const isCES = props.context && props.context.isCES

  const renderCartSummary = () => {
    return !isCES ? (
      <CartSummary hideEWR saveLineLevels />
    ) : (
      <CartSummarySimple hideEWR showEstimateMessage showSaveForLater />
    )
  }

  return (
    <div className="line-level-wrapper">
      <div className="row expanded small-collapse large-uncollapse">
        <div className="columns">
          <ReportUsage />
        </div>
      </div>
      <div className="row expanded small-collapse large-uncollapse">
        <div className="columns print-cart-container small-12 large-9 print-12">
          <div className="hide-for-medium">{renderCartSummary()}</div>
          <IWAccordion name="LineLevel">
            <AdditionalInformationAccordion history={props.history} />
            <LineLevelInfoAccordion history={props.history} />
          </IWAccordion>
          <div className="hide-for-medium">
            <SaveForLater saveLineLevels />
          </div>
        </div>
        <div className="columns small-12 large-3">
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

export default connectToLocale(LineLevel)
