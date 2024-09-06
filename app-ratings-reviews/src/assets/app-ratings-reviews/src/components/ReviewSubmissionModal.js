import React,  { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'

import { t } from '@insight/toolkit-utils';

import ReviewSubmissionFormView from './ReviewSubmissionFormView'
import { submitReview } from '../api/us'
import { BvPixelTrackEvent } from 'lib'


export default class ReviewSubmissionModal extends Component {
	state = {
		agreedToTermsAndConditions: false,
		errors: [],
		nickNameMsg: '',
		reviewMsg: '',
		showSubmissionForm: true,
		titleMsg: '',
  }

	toggleTermsAndCondition = ({ target: {checked, name}}) => {
		this.setState({ [name]: checked })
	}

	handleReviewSubmission = (values) => {
			const { itemInfo, locale, brandName, categoryId } = this.props
			const { agreedToTermsAndConditions } = this.state
			const { fingerPrint, materialId } = itemInfo
			const param = {
				action: 'submit',
				agreedToTermsAndConditions,
				contentType: 'review',
				locale,
				materialId,
				fingerPrint,
				...values,
			}
			return submitReview(param).then((response) => {
				if(!response.data.HasErrors){
					this.setState({
						showSubmissionForm: false,
          })
          BvPixelTrackEvent({
            name: 'submit',
            brand: brandName,
            productId: materialId,
            categoryId: categoryId,
            detail1: 'review'
          })
				}else{
					if(response.data.FormErrors.FieldErrorsOrder){
						const fieldErrors = response.data.FormErrors.FieldErrors
						const { reviewtext, title, usernickname } = fieldErrors
						const reviewMsg = reviewtext && reviewtext.Field === 'reviewtext' && reviewtext.Message
						const titleMsg = title && title.Field === 'title' && title.Message
						const nickNameMsg = usernickname && usernickname.Field === 'usernickname' && usernickname.Message
						this.setState({
							nickNameMsg, reviewMsg, titleMsg
					 })
				 }else{
					 this.movePageUp();
					 const genericErrors = response.data.Errors.map(error => (error.Message === "Duplicate submission") ? t("You have already created a review for this product.") : error.Message);
					 this.setState({
						 errors: genericErrors
					})
				 }
				}
			})
 	}

 	movePageUp = () => {
    let elem = document.getElementById("review-submission-modal");
    elem.scrollIntoView();
  }

	handleReviewSubmit = () => {
		return document.getElementById('review-submission-form')
	   	.dispatchEvent(new CustomEvent('submit', { cancelable: true }))
	}

	render(){
		const { closeModal, itemInfo, locale, modalIsOpen, submissionFormFields} = this.props
		const { agreedToTermsAndConditions, errors, nickNameMsg, reviewMsg, showSubmissionForm, titleMsg } = this.state
		const { description, imageURL } = itemInfo
		const hasFormFields = Object.keys(submissionFormFields).length > 0

		return (
      showSubmissionForm ?
      <Modal
          isOpen={modalIsOpen}
          onClose={closeModal}
          overlayclassname="c-modal-overlay"
          className="c-submit-review-modal"
          size="medium"
        >
          <div  id="review-submission-modal">
            <Modal.Header className='c-submit-review-modal__header' onClick={closeModal}>
              <div className="c-review-product-section o-grid o-grid--gutters">
                <div className="o-grid__item  o-grid__item--shrink">
                  <img className="c-review-product-section__image" src={imageURL} alt={description} />
                </div>
                <div className="o-grid__item">
                  <p className="c-review-product-section__title ">{description}</p>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body id="c-submit-review-modal__form" className="c-submit-review-modal__form">
              <ReviewSubmissionFormView
                agreedToTermsAndConditions={agreedToTermsAndConditions}
                errors={errors}
                handleReviewSubmission={this.handleReviewSubmission}
                hasFormFields= {hasFormFields}
                locale={locale}
                nickNameMsg={nickNameMsg}
                reviewMsg={reviewMsg}
                submissionFormFields={submissionFormFields}
                titleMsg={titleMsg}
                toggleTermsAndCondition={this.toggleTermsAndCondition}
              />
            </Modal.Body>
            <Modal.Footer className="c-submission-modal__footer">
              <Button color="primary" isDisabled={!agreedToTermsAndConditions} type="submit" onClick={this.handleReviewSubmit}>
                {t('Submit')}
              </Button>
              <Button onClick={closeModal} color="secondary">
                {t('Cancel')}
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      :
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        overlayclassname="c-modal-overlay"
        className="c-submit-review-success-modal"
          >
          <Modal.Header className='c-submit-review-modal__header' onClick={closeModal}>
            <div className="o-grid">
              <img className="c-review-product-section__image" src='/content/dam/insight-web/logos/global-nav.svg' alt={description} />
            </div>
          </Modal.Header>
          <Modal.Body className="c-submit-review-success-modal__body">
            <div className='c-modal-body__text'>
              <h2 className="c-modal-body__text-heading">{t('Thank you for submitting a review.')}</h2>
              <div className='o-box  c-modal__content'>
                <p>{t(`Please note, it may take up to 72 hours for your review to appear on insight.com.`)}</p>
              </div>
            </div>
          </Modal.Body>
      </Modal>
		)
	}
}

ReviewSubmissionModal.propTypes = {
	closeModal: PropTypes.func.isRequired,
	itemInfo: PropTypes.shape({
    description: PropTypes.string,
    imageURL: PropTypes.string,
  }).isRequired,
	locale: PropTypes.string.isRequired,
	modalIsOpen: PropTypes.bool.isRequired,
	submissionFormFields:  PropTypes.shape({
		/* key value pairs */
	})
}

ReviewSubmissionModal.defaultProps ={
	submissionFormFields: {},
}
