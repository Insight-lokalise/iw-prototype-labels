import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import { Summary } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { persistor } from '../../index'
import { checkoutGAE } from '@insight/toolkit-utils'
import { ROUTES } from '../../constants'

import ReceiptHeader from './ReceiptHeader'
import { selector_cartItemsGAE } from '../../state/slices/selectors/ShoppingReqeustSelector'
import ShippingBillingInfo from './ShippingBillingInfo'
import CustomerOrderInfoView from '../ReviewOrder/CustomerOrderInfoView'
import CartView from './CartView'
import { updateMiniCart } from './../../lib/Helpers'
import { clear as clearShoppingRequest } from './../../state/slices/shoppingRequestSlice'
import { save as saveLineLevelSessionInfos } from './../../state/slices/lineLevelSessionInfosSlice'

import {
  selector_summary,
  selector_shoppingRequest,
  selector_cart,
  selector_lineLevelSessionInfos,
} from '../../state/slices/selectors/receiptSelector'

const Receipt = (props) => {
  const dispatch = useDispatch()
  const { context } = props
  const { currencyCode } = context
  const cart = useSelector((cartData) => selector_cart(cartData))
  const cartItemsGAE = useSelector((cartItems) =>
    selector_cartItemsGAE(cartItems)
  )
  const summary = useSelector(selector_summary)
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)

  const {
    shipping = {},
    billing = {},
    orderMetaData = {},
  } = shoppingRequest || {}

  useEffect(() => {
    dispatch(clearShoppingRequest())
    dispatch(saveLineLevelSessionInfos([]))
    persistor.flush().then(() => updateMiniCart())
    // checkoutGAE({
    //   step: 5,
    //   cart: cart.summary,
    //   cartItems: cartItemsGAE,
    //   isSaveAsQuote: false,
    //   isOrderTemplate: false,
    //   isQuickCheckout: false,
    //   overridePageTitle: ROUTES['RECEIPT'].name,
    // })
  }, [])

  return (
    <div className="o-grid o-grid--gutters-small">
      <Helmet>
        <title>{t('Receipt')}</title>
        <meta name="description" content={t('Receipt page')} />
      </Helmet>
      <div className="o-grid__item u-1/1 ">
        <ReceiptHeader />
      </div>
      {!!shoppingRequest && (
        <>
          <div className="o-grid__item u-1/1 u-3/4@desktop">
            <ShippingBillingInfo shipping={shipping} billing={billing} />
            <CustomerOrderInfoView
              title="Customer information"
              data={orderMetaData?.userContact}
              isEditable={false}
            />
            <CustomerOrderInfoView
              title="Order information"
              data={orderMetaData?.licenseContact}
              isEditable={false}
            />
            <CartView
              shoppingRequest={shoppingRequest}
              lineLevelSessionInfos={lineLevelSessionInfos}
            />
          </div>
          <div className="o-grid__item u-1/1 u-1/4@desktop">
            <Summary
              currencyCode={shoppingRequest?.soldTo?.currencyCode}
              subtotal={summary?.subTotal}
              estimatedShipping={summary?.shippingCost}
              estimatedTax={summary?.taxCost}
              ewrFee={summary?.ewrFee}
              total={summary?.totalCost}
              pstTaxCost={summary?.pstTaxCost}
              gstHstTaxCost={summary?.gstHstTaxCost}
              locale={shoppingRequest?.locale}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default connectToLocale(Receipt)
