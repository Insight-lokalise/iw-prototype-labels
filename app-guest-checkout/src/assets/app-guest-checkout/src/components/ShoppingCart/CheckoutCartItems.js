import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { checkForGuestCheckoutCookie, deleteGuestCheckoutCookie, getUTCTimeStamp } from '@insight/toolkit-utils'
import { postShoppingRequest } from '../../api/postData'
import { fetchUIFlags, proceedToCheckout } from '../../api/getData'
import { selector_shoppingRequest } from '../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../state/slices/selectors/lineLevelSessionInfosSelector'
import { selector_dep } from '../../state/slices/selectors/depSelector'
import { clear as clearShoppingRequest } from '../../state/slices/shoppingRequestSlice'

const CheckoutCartItems = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const {
    isLoggedIn,
    quickCheckout,
    handleCheckout,
    isCheckoutDisabled
  } =
    props
  const clientBrowserDate = getUTCTimeStamp()
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const depState = useSelector(selector_dep)

  const proceedCheckout = async ({ source = null, isQuickCheckout = null }) => {
    const data = await proceedToCheckout({ source, quickCheckout:isQuickCheckout })
    return data
  }

  const proceedToQuickCheckout = async (isQuickCheckout) => {
    setIsLoading(true)
    // If the user is not logged in, based on cookie route the page
    if (!isLoggedIn) {
      checkForGuestCheckoutCookie ('guest-checkout-enabled')
      return false
    }else{
      // delete cookie
      deleteGuestCheckoutCookie('guest-checkout-enabled')
    }
    let sessionCart;
    if(Object.keys(depState).length !== 0) {
      const { shoppingRequest, lineLevelSessionInfos } = await handleCheckout()
      sessionCart = await postShoppingRequest(
        shoppingRequest,
        lineLevelSessionInfos,
        clientBrowserDate
      )
    }else {
      sessionCart = await postShoppingRequest(
        shoppingRequest,
        lineLevelSessionInfos,
        clientBrowserDate
      )
    }
    if(sessionCart?.contracts && Object.keys(sessionCart.contracts).length > 0 ) {
      window.localStorage.setItem("cartInSession", true)
      const data = await proceedCheckout({ isQuickCheckout })
      const { checkoutState } = data
      if (checkoutState === 'UNDEFINED') {
        setIsLoading(false)
        return
      }
      const flags = await fetchUIFlags()
      const redirectURL = flags.redirectURL
      // @todo this below delete shopping request is not needed when checkout is implemented in app guest checkout
      // dispatch(clearShoppingRequest()) // empty shopping request in redux
      window.location = `/insightweb${redirectURL}`
    } else {
      console.warn(' Failed to transfer UI cart to Session cart')
      setIsLoading(false)
      return
    }



  }
  return (
    <>
      {isLoggedIn && quickCheckout && (
        <div className="c-shopping-cart-button__link">
          <Button
            className="c-button--block c-summary-card-body__save"
            type="submit"
            color="primary"
            isLoading={isLoading}
            onClick={() => proceedToQuickCheckout(true)}
            isDisabled={isCheckoutDisabled}
          >
            {t('Quick checkout')}
          </Button>
        </div>
      )}
      <div className="c-shopping-cart-button__link">
        <Button
          className="c-button--block c-summary-card-body__save"
          type="submit"
          isLoading={isLoading}
          color={!quickCheckout ? 'primary' : 'secondary'}
          onClick={() => proceedToQuickCheckout(false)}
          isDisabled={isCheckoutDisabled}
        >
          {t('Checkout')}
        </Button>
      </div>
      {quickCheckout && (
        <div className="o-grid__item u-1/1 row is-collapse-child hide-for-print c-shopping-cart-button__quicktext">
          <div className="columns">
            {t('*Quick checkout will use default options.')}
          </div>
        </div>
      )}
    </>
  )
}

export default CheckoutCartItems
