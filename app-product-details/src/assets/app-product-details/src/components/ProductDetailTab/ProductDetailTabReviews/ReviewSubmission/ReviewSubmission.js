import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { ReviewSubmissionConfirmation } from './ReviewSubmissionConfirmation'
import { ReviewSubmissionFormModal } from './ReviewSubmissionFormModal'
import { PDPContext, ReviewsContext } from '../../../../context'

export const ReviewSubmission = ({ closeModal, modalIsOpen }) => {
  const { submitReviewAction } = useContext(ReviewsContext)
  const { product } = useContext(PDPContext)

  const placeholder = document.getElementById('react-app-product-details')
  const fingerPrint = placeholder.dataset.fingerprint

  const [submitReviewState, setSubmitReviewState] = useState({
    submitted: false,
    loading: false,
    errors: null,
  })

  const handleReviewSubmission = async (values) => {
    setSubmitReviewState({ loading: true, errors: null })
    try {
      if (!fingerPrint) throw Error('Missing required finger print')

      const param = {
        action: 'submit',
        contentType: 'review',
        materialId: product?.materialId,
        fingerPrint,
        ...values,
      }
      const review = await submitReviewAction(param)
      if (!review.HasErrors) {
        setSubmitReviewState({ loading: false, errors: null, submitted: true })
        return
      }
      if (review.Errors && review.Errors.length) {
        const genericErrors = review.Errors.map((error) =>
          error.Message === 'Duplicate submission'
            ? t('You have already created a review for this product.')
            : error.Message
        )
        setSubmitReviewState({
          loading: false,
          submitted: false,
          errors: genericErrors,
        })
        movePageUp()
        return
      }

      setSubmitReviewState({
        loading: false,
        submitted: false,
      })
    } catch (err) {
      setSubmitReviewState({
        loading: false,
        submitted: false,
        errors: [err.message],
      })
      movePageUp()
    }
  }

  const movePageUp = () => {
    let elem = document.getElementById('review-submission-modal')
    elem.scroll(0, 0)
  }

  if (submitReviewState.submitted) {
    return (
      <ReviewSubmissionConfirmation
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      />
    )
  }

  return (
    <ReviewSubmissionFormModal
      closeModal={closeModal}
      modalIsOpen={modalIsOpen}
      submitReview={handleReviewSubmission}
      submitReviewState={submitReviewState}
    />
  )
}

export default ReviewSubmission
ReviewSubmission.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
}
