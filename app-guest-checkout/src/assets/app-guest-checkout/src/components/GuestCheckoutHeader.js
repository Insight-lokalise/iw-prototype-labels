import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES, stepperIndexMap } from '@constants'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Panel, Steps, Step } from '@insight/toolkit-react'
import { selector_hasWarrantyItem } from '../state/slices/selectors/ShoppingReqeustSelector'
import { selector_hasSellRequirements } from '../state/slices/selectors/lineLevelSessionInfosSelector'

export const GuestCheckoutHeader = () => {
  const location = useLocation()
  const isBasket = location.pathname === ROUTES.CART.url
  if (isBasket) {
    return null
  }
  const history = useHistory()
  const pathNameWithoutHash = location.pathname.split(location.hash || '#')[0]
  const activeStepperIndex = stepperIndexMap[pathNameWithoutHash] || 0

  const hasWarrantyItem = useSelector(selector_hasWarrantyItem)
  const hasSellRequirements = useSelector(selector_hasSellRequirements)
  const showItemInfoStep = hasWarrantyItem || hasSellRequirements
  const inReceiptPage = window.location.pathname == '/insightweb/receipt'

  const goToStep = (step) => {
    history.push({ pathname: step })
  }

  useEffect(() => {
    // send custom event on location change to app-header to show checkout header
    const unlisten = history.listen(() => {
      window.postMessage({ type: 'location:updated' }, window.location.origin)
    })

    // stop the listener when component unmounts
    return unlisten
  }, [])

  return (
    !inReceiptPage && (
      <Panel className="c-guest-checkout--header c-guest-checkout-panel">
        <Panel.Body>
          <h1 className="u-h3 u-text-bold">{t('Checkout')}</h1>
          <Steps activeIndex={activeStepperIndex}>
            <Step
              id="customer-info"
              onClick={() => goToStep(ROUTES.CUSTOMER_INFO.url)}
            >
              {t(ROUTES.CUSTOMER_INFO.name)}
            </Step>
            {showItemInfoStep && (
              <Step
                id="item-info"
                onClick={() => goToStep(ROUTES.ITEM_INFO.url)}
              >
                {t(ROUTES.ITEM_INFO.name)}
              </Step>
            )}
            <Step
              id="shipping-billing"
              onClick={() => goToStep(ROUTES.SHOPPING_INFO.url)}
            >
              {t(ROUTES.SHOPPING_INFO.name)}
            </Step>
            <Step id="place-order" onClick={() => goToStep(ROUTES.REVIEW.url)}>
              {t(ROUTES.REVIEW.name)}
            </Step>
          </Steps>
        </Panel.Body>
      </Panel>
    )
  )
}
