import React,  { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Loading } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import ReviewSubmissionFormView from './ReviewSubmissionFormView'
import { getProductInfo, submitReview } from '../api/us'

export default class ReviewSubmissionForm extends Component {
	state = {
		agreedToTermsAndConditions: false,
		description: '',
		isLoading: true,
		imageURL: '',
		nickNameMsg: '',
		reviewMsg: '',
		showSubmissionForm: true,
		titleMsg: '',
    errors: []
  }

	componentDidMount() {
		const { bvInfo } = this.props
		const { locale, materialId } = bvInfo
		const param = {
			locale,
			materialId,
		}

		return getProductInfo(param).then((response) => {
			const data = response.data.products[0]
			this.setState({
				description: data.description,
				isLoading: false,
				imageURL: data.image.largeImage,
			})
		})
	}

	toggleTermsAndCondition = ({ target: {checked, name}}) => {
		this.setState({ [name]: checked })
	}

  movePageUp = () => {
    const elem = document.getElementById("react-app-review-submission");
    elem.scrollIntoView();
  }

	handleReviewSubmission = (values) => {
			const { bvInfo } = this.props
			const { agreedToTermsAndConditions } = this.state
			const { bvcampaignId, bvuserToken, fingerPrint, locale, materialId } = bvInfo
			const param = {
				action: 'submit',
				agreedToTermsAndConditions,
				campaignId : bvcampaignId,
				user : bvuserToken,
				contentType: 'review',
				fingerPrint,
				locale,
				materialId,
				...values,
			}
			return submitReview(param).then((response) => {
				if(!response.data.HasErrors){
					this.setState({
						showSubmissionForm: false,
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
          } else {
            this.movePageUp();
            const genericErrors = response.data.Errors.map(error => (error.Message === "Duplicate submission") ? t("You have already created a review for this product.") : error.Message);
            this.setState({
              errors: genericErrors
            })
          }

				}
			})
 	}

	handleReviewSubmit = () => {
		return document.getElementById('review-submission-form')
	   	.dispatchEvent(new CustomEvent('submit', { cancelable: true }))
	}

	render(){
		const { agreedToTermsAndConditions, errors, description, imageURL, isLoading, nickNameMsg, reviewMsg, showSubmissionForm, titleMsg } = this.state
		const { bvInfo } = this.props
		const { locale } = bvInfo
		return (
			<div data-testid='review-submission-form'>
				{isLoading ?
					<div><Loading size='small' /></div>
					:
					(showSubmissionForm ?
            <div className="review-submission">
              <div className="c-review-submission">
                <ReviewSubmissionFormView
                  agreedToTermsAndConditions={agreedToTermsAndConditions}
                  errors={errors}
                  description={description}
                  handleReviewSubmission={this.handleReviewSubmission}
                  imageURL={imageURL}
                  locale={locale}
                  nickNameMsg={nickNameMsg}
                  reviewMsg={reviewMsg}
                  titleMsg={titleMsg}
                  toggleTermsAndCondition={this.toggleTermsAndCondition}
                />
                <div className="o-grid o-grid--justify-right">
                  <Button className="c-button--block o-grid__item u-1/1 u-1/3@desktop" color="primary" isDisabled={!agreedToTermsAndConditions} type="submit" onClick={this.handleReviewSubmit}>
                    {t('Submit')}
                  </Button>
                </div>
              </div>
            </div>
					: <div className='review-submission-success c-modal-body__text'>
							<h2 className="c-modal__heading">{t('Thank you for submitting a review.')}</h2>
							<div className='o-box  c-modal__content'>
								<p>{t("Please note, it may take up to 72 hours for your review to appear on insight.com")}</p>
							</div>
						</div>
					)
				}

			</div>
		)
	}
}

ReviewSubmissionForm.propTypes = {
	bvInfo: PropTypes.shape({
		bvcampaignId:PropTypes.string,
		bvuserToken:PropTypes.string,
    materialId: PropTypes.string,
    fingerPrint: PropTypes.string,
  }).isRequired,
}
