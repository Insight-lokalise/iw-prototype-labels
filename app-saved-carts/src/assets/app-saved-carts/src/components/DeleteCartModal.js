import React, { Fragment } from 'react'
import { Button, Loading, Modal } from '@insight/toolkit-react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function AddToCartModal({ cartName, closeModal, deleteCartConfirm, isDone, isModalOpen }) {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <Modal.Header>{t('Confirm delete')}</Modal.Header>
        { isDone ? (
          <Fragment>
            <Modal.Body>
              <p><strong>{cartName}</strong></p>
              <p>{t(`Are you sure you want to delete this cart?`)}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={deleteCartConfirm} color='primary'>{t('Yes')}</Button>
              <Button onClick={closeModal} color='secondary'>{t('Cancel')}</Button>
            </Modal.Footer>
          </Fragment>
        ) : (
          <Modal.Body className="u-text-center">
            <Loading size="large" />
          </Modal.Body>
        )}
      </Modal>
    )
}

AddToCartModal.propTypes = {
  cartName: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteCartConfirm: PropTypes.func.isRequired,
  isDone: PropTypes.bool.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
}
