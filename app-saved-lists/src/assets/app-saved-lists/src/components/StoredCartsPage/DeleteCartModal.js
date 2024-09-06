import React from 'react'
import { Button,  Modal } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";
import {deleteStoredCart as deleteStoredCartAPI} from '../../api/deleteStoredCart'

export const DeleteCartModal = ({
  loginId,
  cartId,
  itemId,
  setCartId,
  setItemId,
  onClose,
  fetchCart,
  addToast,
  setIsWarrantyOnly,
  isWarrantyOnly = false,
  islineLevel = false,
}) => {
  const headerLevelText = t('Are you sure you want to delete this list?')
  const lineLevelText = t('Are you sure you want to delete this item?')
  const bodyText = islineLevel? lineLevelText: headerLevelText
  const headerLevelDeleteText = t('Deleted list successfully. ')
  const lineLevelDeleteText = t('Deleted item successfully.')
  const toastSuccessMessage = islineLevel? lineLevelDeleteText: headerLevelDeleteText
  const headerLevelFailText = t('Failed to delete list. ')
  const lineLevelFailText = t('Failed to delete item.')
  const toastFailMessage = islineLevel? lineLevelFailText: headerLevelFailText


  const onDeleteHandler = async() => {
    onClose()
    try{
      await deleteStoredCartAPI(loginId, cartId, itemId, isWarrantyOnly)
      await fetchCart()
      addToast({message: t(`${toastSuccessMessage}`), type:'success'})
    }catch(error) {
      addToast({message: t(`${toastFailMessage}`), type:'danger'})
    }
    setCartId('')
    setItemId('')
    setIsWarrantyOnly(false)
  }
  const handleClose = () => {
    onClose()
    setCartId('')
    setItemId('')
    setIsWarrantyOnly(false)
  }

  return (
    <Modal isOpen onClose={onClose} size="small" closeOnOutsideClick={false} className='c-loginInfo-modal' data-testid='login-info-form'>
      <Modal.Body id="savedListsDeleteModal">
        <p>{bodyText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="secondary" size="small" onClick={handleClose}>
          {t("Cancel")}
        </Button>
        <Button
          color="primary"
          onClick={onDeleteHandler}
          size="small"
        >
          {t("Delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
