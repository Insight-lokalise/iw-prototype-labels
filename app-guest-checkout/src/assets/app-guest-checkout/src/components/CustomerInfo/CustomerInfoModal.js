import React, { useEffect, } from 'react'
import { useSelector } from 'react-redux'
import { t } from '@insight/toolkit-utils/lib/labels'
import { ButtonGroup, Button, Modal } from '@insight/toolkit-react'
import { checkoutGAE } from '@insight/toolkit-utils'
import { ROUTES } from '../../constants'
import { selector_cart, selector_cartItemsGAE } from '../../state/slices/selectors/ShoppingReqeustSelector'

const CustomerInfoModal = ({
  isOpen,
  onClose,
  onSignIn,
  onGuestCheckout,
  isLoading,
}) => {
  const  cart  = useSelector(cartData => selector_cart(cartData))
  const cartItemsGAE = useSelector(cartItems => selector_cartItemsGAE(cartItems))
  
  useEffect(()=>{
    // this step is used to track the guest checkout popup 
    checkoutGAE({step: 0,
      cart: cart.summary,
      cartItems: cartItemsGAE,
      isSaveAsQuote: false,
      isOrderTemplate: false,
      isQuickCheckout: false,
      overridePageTitle: ROUTES['CUSTOMER_INFO'].name
    });
  },[])

  return (
    <Modal
      isOpen={isOpen}
      size="medium"
      onClose={onClose}
      data-testid={'guest-checkout-modal-'}
      closeOnOutsideClick={false}
      id="guest-checkout-modal"
    >
      <Modal.Body id="guest-checkout-modal-body">
        <p className="u-text-bold u-margin-top guest-checkout-modal-body__question">
          {t('Are you sure you want to check out as a Guest?')}
        </p>
        <p className="guest-checkout-modal-body__benefits">
          {t(
            'By signing in, you can take advantage of the following benefits:'
          )}
        </p>
        <ul>
          <li>{t('Place orders quickly and easily')}</li>
          <li>
            {t('Conveniently view and track statuses of previous orders')}
          </li>
          <li>{t('Easily reorder previous products')}</li>
        </ul>
        <div>
          <p className="u-text-bold">
            {t('If you continue with Guest Checkout:')}
          </p>
          <ul>
            <li>
              {t('This order will not appear in your account order history')}
            </li>
            <li>
              {t(
                'Address and payment information must be entered for each transaction'
              )}
            </li>
          </ul>
        </div>

        <ButtonGroup align="right" className="buttons">
          <Button color="secondary" onClick={onSignIn} data-id="sign-in-btn">
            {t('Sign in')}
          </Button>
          <Button
            color="primary"
            data-testid="continue-as-guest-btn"
            isLoading={isLoading}
            onClick={onGuestCheckout}
          >
            {t('Continue as guest')}
          </Button>
        </ButtonGroup>
      </Modal.Body>
    </Modal>
  )
}

export default CustomerInfoModal
