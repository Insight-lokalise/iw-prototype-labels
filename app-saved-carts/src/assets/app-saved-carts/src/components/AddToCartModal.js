import React, { Fragment } from 'react'
import { Button, Loading, Modal } from '@insight/toolkit-react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function AddToCartModal({ cartName, closeModal, goToCheckout, isDone, isModalOpen }) {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <Modal.Header>{t('Added to cart')}</Modal.Header>
        { isDone ? (
          <Fragment>
            <Modal.Body data-testid='modal-with-footer'>
              <p><strong>{cartName}</strong></p>
              <p>{t('Saved items have been moved into your Cart.')}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={goToCheckout} color='primary'>{t('Continue to checkout')}</Button>
              <Button onClick={closeModal} color='secondary'>{t('Continue shopping')}</Button>
            </Modal.Footer>
          </Fragment>
        ) : (
          <Modal.Body data-testid='modal-without-footer' className="u-text-center">
            <Loading size="large" />
          </Modal.Body>
        )}
      </Modal>
    )
}

AddToCartModal.propTypes = {
  cartName: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  goToCheckout: PropTypes.func.isRequired,
  isDone: PropTypes.bool.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
}
