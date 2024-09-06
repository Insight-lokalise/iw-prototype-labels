import React from 'react'
import { Button,  Modal } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";

export const ProductGroupLinkModal = ({
  categoryId,
  productGroupId,
  onClose,
}) => {

  const handleClose = () => {
    onClose()
  }

  const productGroupLink = `/insightweb/companyStandards/${categoryId}/${productGroupId}`;

  const copyToClickBoard = () => {
    navigator.clipboard.writeText(productGroupLink);
  }

  return (
    <Modal isOpen onClose={handleClose} size="medium" closeOnOutsideClick className='product-group-link-modal' data-testid='product-group-link'>
      <Modal.Body  id="productGroupLinkModal">
        <p className='product-info'>{t("Copy and paste the URL below to link directly to this category and associated product groups from the client's welcome")}</p>
        <div className='border-divider'></div>
        <p className='product-link'>{productGroupLink}</p>
        <Button color='link' onClick={() => copyToClickBoard()}>{t('Copy')}</Button>
      </Modal.Body>
    </Modal>
  )
}
