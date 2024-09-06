import React from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import {ButtonGroup, Button, Modal} from '@insight/toolkit-react'

export default function PaymentDeleteModal(props){
  const {
    onClose,
    onSubmit,
  } = props
  return (
    <Modal isOpen onClose={onClose} size="small" closeOnOutsideClick={false} className='c-confirm-modal'>
      <Modal.Body id='paymentDeleteModal'>
        <p>{t('Are you sure you want to delete this card?')}</p>
        <ButtonGroup align='right'>
          <Button color="link" onClick={onClose}>{t('Cancel')}</Button>
          <Button color="primary" onClick={onSubmit}>{t('Delete')}</Button>
        </ButtonGroup>
      </Modal.Body>
    </Modal>
  )
}