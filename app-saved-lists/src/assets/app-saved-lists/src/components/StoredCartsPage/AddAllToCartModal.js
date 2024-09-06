import React from 'react'
import { Button,  Modal } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";

export const AddAllToCartModal = ({
  setCartId,
  onClose,
}) => {

  const handleClose = () => {
    onClose()
    setCartId('')
  }

  return (
    <Modal isOpen onClose={handleClose} size="medium" closeOnOutsideClick className='c-loginInfo-modal' data-testid='login-info-form'>
      <Modal.Header onClick={handleClose}>{t('Added to cart')}</Modal.Header>
      <Modal.Body  id="savedListsAddCartModal">
        <p>{t('Saved items have been moved into your cart.')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="primary"  href="/insightweb/cart" size="small">
          {t('Continue to checkout')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
