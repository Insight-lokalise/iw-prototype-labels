import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { Image } from '../../../../shared/Image/Image'
import { PDPContext } from '../../../../context'

export const ReviewSubmissionConfirmation = ({ modalIsOpen, closeModal }) => {
  const { product } = useContext(PDPContext)
  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={closeModal}
      overlayclassname="c-modal-overlay"
      className="c-submit-review-success-modal"
    >
      <Modal.Header
        className="c-submit-review-modal__header"
        onClick={closeModal}
      >
        <div className="o-grid">
          <Image
            className="c-review-product-section__image"
            src="/content/dam/insight-web/logos/global-nav.svg"
            alt={product?.descriptions?.shortDescription}
          />
        </div>
      </Modal.Header>
      <Modal.Body className="c-submit-review-success-modal__body">
        <div className="c-modal-body__text">
          <h2 className="c-modal-body__text-heading">
            {t('Thank you for submitting a review.')}
          </h2>
          <div className="o-box  c-modal__content">
            <p>
              {t(
                `Please note, it may take up to 72 hours for your review to appear on insight.com.`
              )}
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

ReviewSubmissionConfirmation.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
}

export default ReviewSubmissionConfirmation
