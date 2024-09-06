import React, { useState } from 'react'
import { Button, Summary } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { enrollmentInfoToUpdate } from './../../businessContainerApps/cart/helpers'
import {
  selector_webLoginProfileId,
} from '../../User/selectors/index'
import { selector_featureFlags } from './../../flags/selectors'
import { connect } from 'react-redux'
import SaveAsListModal from '../saveAsList/SaveAsListModal'
import { saveCartAsList } from './../../models/SavedLists/savedList'
import { getShoppingRequest } from '../../models/ShoppingRequest'
import { emptyCart, setEnrollmentInfo } from '../../models/Cart'

export function CartSummarySimple(props) {
  const {
    featureFlags,
    cartIsEmpty,
    emptyCartAction,
    enrollmentInfo,
    transformCartAction,
    showSaveForLater,
    showEstimateMessage,
    children,
    ewrFeeAmount,
    isCartPage,
    isPastShippingOptions,
    isSimplifiedCESUser,
    isStockAndPriceDisplayDisabled,
    shippingCost,
    gstHstTaxCost,
    pstTaxCost,
    isCanada,
    taxCost,
    hideEWR,
    useShoppingRequest,
    cart: { subTotal, currency },
    hasOutOfStockItems,
    hasQtyExceedsStockCartItems,
    locale,
    webLoginProfileId,
    hideCartOptions,
    showShippingHelpText,
    showTooltipForTax,
    isEMEA,
  } = props

  const [isSaveListOpen, setIsSaveListOpen] = useState(false)

  const closeSaveListModal = (isClearCart = false) => {
    setIsSaveListOpen(false)
    if (isClearCart) {
      if (isCartPage) {
        emptyCartAction()
      } else {
        window.location.href = window.location.origin
      }
    }
  }

  const sumTotal =
    subTotal +
    shippingCost +
    taxCost +
    ewrFeeAmount +
    gstHstTaxCost +
    pstTaxCost

  const handleSaveCartAsList = async (name, isClearCart) => {
    const shoppingRequest = await getShoppingRequest()
    const response = await saveCartAsList({
      name,
      shoppingRequest,
      userId: webLoginProfileId,
    })
    if (isClearCart) {
      await emptyCart()
    }
    return response
  }

  const openSaveListModal = async () => {
    try {
      // Process DEP enrollment
      const { hasEnrollmentInfoToUpdate, optInPartners, optOutPartners } =
        enrollmentInfoToUpdate(enrollmentInfo)
      if (hasEnrollmentInfoToUpdate) {
        await setEnrollmentInfo({
          enrollments: optInPartners,
          removedIds: optOutPartners,
        })
      }
      setIsSaveListOpen(true)
    } catch (error) {
      throw new Error('Failed to save enrollment ')
    }
  }

  const saveList = async ({ name, isClearCart }) => {
    // Check if its cart page
    if (!isCartPage) {
      return await handleSaveCartAsList(name, isClearCart)
    } else {
      try {
        // Transform cart to shopping request
        await transformCartAction()
        return await handleSaveCartAsList(name, isClearCart)
      } catch (error) {
        throw new Error('Failed to save cart as list')
      }
    }
  }

  const saveQuote = async () => {
    // Check if its cart page
    if (!isCartPage) return (window.location = '/insightweb/quotes/save')
    try {
      // Process DEP enrollment
      const { hasEnrollmentInfoToUpdate, optInPartners, optOutPartners } =
        enrollmentInfoToUpdate(enrollmentInfo)
      if (hasEnrollmentInfoToUpdate) {
        await setEnrollmentInfo({
          enrollments: optInPartners,
          removedIds: optOutPartners,
        })
      }
      // Transform cart to shopping request
      await transformCartAction()
      // Redirect to the save quote page
      window.location = '/insightweb/quotes/save'
    } catch (error) {}
  }

  const saveAsQuoteText = t('Save as quote')

  return (
    !cartIsEmpty && (
      <div className="c-cart-summary-simple">
        {!isStockAndPriceDisplayDisabled ? (
          <Summary
            currencyCode={currency}
            subtotal={subTotal}
            estimatedShipping={shippingCost}
            estimatedTax={taxCost}
            gstHstTaxCost={gstHstTaxCost}
            pstTaxCost={pstTaxCost}
            isCanada={isCanada}
            ewrFee={hideEWR ? 0 : ewrFeeAmount}
            total={sumTotal}
            locale={locale}
            showShippingHelpText={showShippingHelpText}
            showTooltipForTax={showTooltipForTax}
            showEstimateMessage={showEstimateMessage}
            showEstimateDash={!isPastShippingOptions && !useShoppingRequest && !isEMEA} //show dashes when user has not gone past shipping options and values are $0
          >
            {children}
            {showShippingHelpText &&
              <div className="c-cart-summary-simple__shipping-footnote">
                {
                  t('*Shipping rates are calculated based on your default information. Other shipping rate options can be viewed and selected on the next page.')
                }
              </div>
            }
            {!hideCartOptions && (
              <div className="o-grid__item u-1/1 c-cart-options hide-for-print">
                {(featureFlags['CES-1520-saved-lists'] ||
                  !isSimplifiedCESUser) && (
                  <>
                    <hr />
                    <div className="u-text-bold">{`${t('Cart options')}:`}</div>
                  </>
                )}
                {showSaveForLater && !isSimplifiedCESUser && (
                  <div className="c-cart-summary-simple__link">
                    <Button
                      color="link"
                      data-testid="save-quote"
                      onClick={saveQuote}
                    >
                      {saveAsQuoteText}
                    </Button>
                  </div>
                )}
                {featureFlags['CES-1520-saved-lists'] && (
                  <div className="c-cart-summary-simple__link">
                    <Button
                      color="link"
                      data-testid="save-list"
                      onClick={openSaveListModal}
                    >
                      {t('Save as list')}
                    </Button>
                  </div>
                )}
              </div>
            )}
            <SaveAsListModal
              isOpen={isSaveListOpen}
              onClose={closeSaveListModal}
              onSaveList={saveList}
            />
          </Summary>
        ) : (
          showSaveForLater &&
          !hideCartOptions && (
            <div className="o-grid c-summary-card">
              {children}
              <div className="o-grid__item u-1/1 c-cart-summary-simple__link hide-for-print">
                <Button
                  color="link"
                  data-testid="save-quote"
                  onClick={saveQuote}
                  disabled={hasOutOfStockItems || hasQtyExceedsStockCartItems}
                >
                  {saveAsQuoteText}
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    )
  )
}

function mapStateToProps(state) {
  return {
    webLoginProfileId: selector_webLoginProfileId(state),
    featureFlags: selector_featureFlags(state),
  }
}

export default connect(mapStateToProps, null)(CartSummarySimple)
