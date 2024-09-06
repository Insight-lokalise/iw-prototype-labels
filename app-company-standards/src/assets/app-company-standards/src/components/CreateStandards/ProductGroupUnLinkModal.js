import React from 'react'
import { Modal, Button, ButtonGroup } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";

export const ProductGroupUnLinkModal = ({ onClose, onSubmit }) => {
  return (
    <Modal isOpen onClose={onClose} size="medium" closeOnOutsideClick className='product-group-link-modal' data-testid='product-group-link'>
      <Modal.Body  id="productGroupLinkModal">
        <div>{t('This product group will be unlinked from the master product group. Are you sure you want to continue?')}</div>
        <ButtonGroup align="right">
          <Button color='link' onClick={onClose}>{t('Cancel')}</Button>
          <Button color='link' onClick={onSubmit}>{t('Unlink')}</Button>
        </ButtonGroup>
      </Modal.Body>
    </Modal>
  )
}
