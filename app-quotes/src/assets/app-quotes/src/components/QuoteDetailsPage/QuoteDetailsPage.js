import React, { useContext, useEffect, useState } from 'react'
import { Button, Panel, Summary } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import { isItemInvalid, isQuoteExpired } from '../../lib/helpers'
import { convertQuoteToOrder, convertQuoteToOrderShoppingReq } from '../../api'
import { QuoteDetailsHeader } from './QuoteDetailsHeader'
import { QuoteDetailsItems } from './QuoteDetailsItems'
import { QuoteDetailsContext } from '../../context/QuoteDetailsContext'

export const QuoteDetailsPage = ({ addToast, locale }) => {
  document.title = t('Quote details')
  const { quoteDetails, getAccountInformation } =
    useContext(QuoteDetailsContext)
  const {
    accountName,
    createdOn,
    expires,
    isConverted,
    quoteName,
    quoteNumber,
    referenceNumber,
    opportunityId,
  } = quoteDetails?.header
  const [isInvalid, setIsInvalid] = useState(false)
  const [isCES, setIsCES] = useState(false)
  const [isAnyItemInvalid, setIsAnyItemInvalid] = useState(false)
  const [isCanada, setIsCanada] = useState(false)
  const [webGroupId, setWebGroupId] = useState(null)
  const { cart, soldTo } = quoteDetails?.shoppingRequest
  const {
    ewrFee,
    gstHstTaxCost,
    pstTaxCost,
    shippingCost,
    subTotal,
    taxCost,
    totalCost,
  } = cart.summary
  const isExpired = isQuoteExpired(expires)
  const showEstimateMessage = isAnyItemInvalid && !isInvalid

  useEffect(() => {
    if (cart.cartItems?.some(isItemInvalid)) {
      setIsAnyItemInvalid(true)
    }
  }, [cart])

  useEffect(() => {
    ;(async () => {
      const userRes = await getAccountInformation()
      const isCanadaUser = userRes?.salesOrg === '4100'
      setIsCanada(isCanadaUser)
      setIsCES(userRes?.isCES)
      setWebGroupId(userRes?.webGroupId)
    })()
  }, [])

  const isShoppingReqWGEnabled = isCES && window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, false, isShoppingReqWGEnabled)

  return (
    <div className="c-app-quote-details">
      <div className="c-app-quote-details__top o-grid">
        <div className="c-app-quote-details__top__details o-grid__item">
          <Panel className="c-app-quote-details__card">
            <Panel.Body>
              <QuoteDetailsHeader
                quoteId={quoteNumber}
                quoteName={quoteName}
                quoteReferenceNumber={referenceNumber}
                quoteCreatedDate={createdOn}
                quoteExpirationDate={expires}
                accountNumber={soldTo.id}
                accountName={accountName}
                isAnyItemInvalid={isAnyItemInvalid}
                isConverted={isConverted}
                isExpired={isExpired}
                addToast={addToast}
              />
            </Panel.Body>
          </Panel>
        </div>
        <div className="c-app-quote-details__top__summary o-grid__item u-1/4@desktop u-2/5@tablet u-1/1">
          <Summary
            currencyCode={soldTo.currency}
            isInvalid={isInvalid}
            subtotal={subTotal}
            estimatedShipping={shippingCost}
            estimatedTax={taxCost}
            gstHstTaxCost={gstHstTaxCost}
            pstTaxCost={pstTaxCost}
            isCanada={isCanada}
            ewrFee={ewrFee}
            showEstimateMessage={showEstimateMessage}
            total={totalCost}
            locale={locale}
          >
            <div className="'o-grid__item u-1/1 c-summary-card-body">
              {isExpired ? (
                <p className="c-app-quote-details__summary-expired">
                  {t('This quote has expired.')}
                </p>
              ) : null}

              <Button
                fullWidth
                color="primary"
                isDisabled={isExpired || isInvalid || isConverted}
                className="hide-for-print"
                onClick={() =>
                  isShoppingCartEnabled
                    ? convertQuoteToOrderShoppingReq(quoteDetails)
                    : convertQuoteToOrder(quoteNumber, opportunityId)
                }
              >
                {t('Convert to order')}
              </Button>
            </div>
          </Summary>
        </div>
      </div>
      <QuoteDetailsItems
        setIsInvalid={setIsInvalid}
        shoppingRequest={quoteDetails?.shoppingRequest}
      />
    </div>
  )
}

export default QuoteDetailsPage
