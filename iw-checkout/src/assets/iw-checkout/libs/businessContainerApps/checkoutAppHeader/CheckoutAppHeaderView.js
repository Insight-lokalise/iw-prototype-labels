import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { t } from '@insight/toolkit-utils/lib/labels'
import { connectToLocale, Steps, Step } from '@insight/toolkit-react'
import OrderUtilities from '../orderUtilities/OrderUtilities'

import ROUTES from '../../routes'
import cn from 'classnames'

export function CheckoutAppHeaderView(props) {
  const { history, pathname } = props

  const goToStep = (step) => {
    history.push({ pathname: step })
  }

  if (props.context.isCES) {
    useEffect(() => {
      //send custom event on location change to app-header to show checkout header
      const unlisten = history.listen(() => {
        window.postMessage({ type: 'location:updated' }, window.location.origin)
      })

      // stop the listener when component unmounts
      return unlisten
    }, [])
  }

  return ROUTES.RECEIPT !== pathname && ROUTES.PROCESS_ORDER !== pathname ? (
    <div className="row expanded small-collapse large-uncollapse hide-for-print">
      <Helmet>
        <title>{t(props.title)}</title>
        {
          // Check for IE to render favicon
          (window.navigator.userAgent.indexOf('MSIE ') > -1 ||
            window.navigator.userAgent.indexOf('Trident/') > -1) && [
            <link
              rel="SHORTCUT ICON"
              type="image/x-icon"
              href="https://www.insight.com/content/dam/insight-web/logos/favicon.ico"
            />,
            <link
              rel="icon"
              type="image/x-icon"
              href="https://www.insight.com/content/dam/insight-web/logos/favicon.ico"
            />,
          ]
        }
      </Helmet>

      <div className="column shopping-cart">
        <div className="shopping-cart__header">
          <div className="row expanded is-collapse-child align-justify align-middle">
            <div
              className={cn(
                {
                  shrink: props.context.isCES,
                  'medium-expand': !props.context.isCES,
                },
                'columns small-12 '
              )}
            >
              <h1 className="shopping-cart__header-title">{t(props.title)}</h1>
            </div>
            {!props.context.isCES && props.showOrderUtilities && (
              <OrderUtilities
                hideExportAsFile={props.hideExportAsFile}
                hideSendToColleague={props.hideSendToColleague}
                showOrderReviewDetails={props.showOrderReviewDetails}
                showOrderReceiptDetails={props.showOrderReceiptDetails}
                pathname={props.pathname}
                hidePrintFeature={props.hidePrintFeature}
              />
            )}
          </div>
          {!props.hideStepper && (
            <div className="row expanded is-collapse-child align-center hide-for-print">
              <Steps activeIndex={props.activeStepperIndex}>
                {props.showLineLevelStep && (
                  <Step
                    id="Step-Edit-Line"
                    onClick={() => goToStep(ROUTES.LINE_LEVEL)}
                  >
                    {t('Order & item information')}
                  </Step>
                )}
                {props.isB2BUser && !props.freightTax ? null : (
                  <Step
                    id="Step-Ship-Bill"
                    onClick={() => goToStep(ROUTES.SHIP_BILL_PAY)}
                  >
                    {t('Shipping & billing')}
                  </Step>
                )}
                {!props.isB2BUser &&
                  (props.isRequisition ? (
                    <Step
                      id="Step-Requisition"
                      onClick={() => goToStep(ROUTES.PLACE_ORDER)}
                    >
                      {t('Place requisition')}
                    </Step>
                  ) : (
                    <Step
                      id="Step-Order"
                      onClick={() => goToStep(ROUTES.PLACE_ORDER)}
                    >
                      {t('Place order')}
                    </Step>
                  ))}
              </Steps>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default connectToLocale(CheckoutAppHeaderView)

CheckoutAppHeaderView.propTypes = {
  activeStepperIndex: PropTypes.number.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
  hideExportAsFile: PropTypes.bool.isRequired,
  hideSendToColleague: PropTypes.bool.isRequired,
  hideStepper: PropTypes.bool.isRequired,
  showLineLevelStep: PropTypes.bool.isRequired,
  showOrderUtilities: PropTypes.bool.isRequired,
  showReturnToCartLink: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  isRequisition: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  hidePrintFeature:PropTypes.string.isRequired
}
