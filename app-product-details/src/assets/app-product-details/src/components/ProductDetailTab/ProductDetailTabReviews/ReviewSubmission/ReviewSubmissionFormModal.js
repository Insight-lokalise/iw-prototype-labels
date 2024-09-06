import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@insight/toolkit-react'
import { Image } from '../../../../shared/Image/Image'
import { ReviewSubmissionForm } from './ReviewSubmissionForm'
import { PDPContext } from '../../../../context'

export const ReviewSubmissionFormModal = ({
  closeModal,
  modalIsOpen,
  submitReview,
  submitReviewState,
}) => {
  const { product } = useContext(PDPContext)
  const productImage = product.images?.[0]?.images?.MD?.[0]

  return (
    <Modal
      isOpen={modalIsOpen}
      closeOnOutsideClick={false}
      closeOnEsc={false}
      onClose={closeModal}
      id="review-submission-modal"
      size="medium"
    >
      <Modal.Header onClick={closeModal}>
        <div className="o-grid o-grid--gutters">
          <div className="o-grid__item u-2/6">
            <Image
              src={productImage?.url}
              alt={product?.descriptions?.shortDescription}
            />
          </div>
          <div className="o-grid__item u-4/6">
            {product?.descriptions?.shortDescription}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <ReviewSubmissionForm
          closeModal={closeModal}
          submitReview={submitReview}
          submitReviewState={submitReviewState}
        />
      </Modal.Body>
    </Modal>
  )
}

ReviewSubmissionFormModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  submitReview: PropTypes.func.isRequired,
  submitReviewState: PropTypes.shape.isRequired,
}

export default ReviewSubmissionFormModal
