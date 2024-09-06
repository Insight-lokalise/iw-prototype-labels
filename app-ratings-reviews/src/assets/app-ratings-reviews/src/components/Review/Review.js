import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils';
import { BvPixelTrackEvent } from 'lib'
import { submitFeedback } from 'api'

import Content from './Content'
import Stars from './Stars'
import Helpfulness from './Helpfulness'

export default class Review extends Component {
	state = {
		expanded: false,
		negativeHelpfulnessSubmitted: false,
		positiveHelpfulnessSubmitted: false,
		reportSubmitted: false,
		totalPositiveFeedbackCount: this.props.review.TotalPositiveFeedbackCount,
		totalNegativeFeedbackCount: this.props.review.TotalNegativeFeedbackCount
	}

	handleFeedbackSubmission = (feedbackType, vote) => {
		const { reviewID, materialId, brandName, categoryId } = this.props
		return submitFeedback({
			contentId: reviewID,
			contentType: 'review',
			feedbackType,
			vote
		}).then(() => {
			BvPixelTrackEvent({
				name: feedbackType,
				brand: brandName,
				productId: materialId,
				categoryId: categoryId,
				detail1: vote,
				detail2: reviewID
			})
		})
	}

	increaseNegativeCount = () => {
		const { negativeHelpfulnessSubmitted, positiveHelpfulnessSubmitted, totalNegativeFeedbackCount } = this.state
		if (!(positiveHelpfulnessSubmitted || negativeHelpfulnessSubmitted)) {
			this.handleFeedbackSubmission('helpfulness', 'Negative').then(() => {
				this.setState({
					negativeHelpfulnessSubmitted: true,
					totalNegativeFeedbackCount: totalNegativeFeedbackCount + 1
				})
			})
		}
	}

	increasePositiveCount = () => {
		const { negativeHelpfulnessSubmitted, positiveHelpfulnessSubmitted, totalPositiveFeedbackCount } = this.state
		if (!(positiveHelpfulnessSubmitted || negativeHelpfulnessSubmitted)) {
			this.handleFeedbackSubmission('helpfulness', 'Positive').then(() => {
				this.setState({
					positiveHelpfulnessSubmitted: true,
					totalPositiveFeedbackCount: totalPositiveFeedbackCount + 1
				})
			})
		}
	}

	showMoreOrLessText = () => {
		this.setState(({ expanded }) => ({
			expanded: !expanded
		}))
		const { reviewID, materialId, brandName, categoryId } = this.props
		BvPixelTrackEvent({
			name: 'read_more',
			brand: brandName,
			productId: materialId,
			categoryId: categoryId,
			detail1: this.state.expanded ? t('collapse') : t('expand'),
			detail2: reviewID
		})
	}

	submitReport = () => {
		const { reviewID, materialId, brandName, categoryId } = this.props
		if (!this.state.reportSubmitted) {
			return submitFeedback({
				contentId: reviewID,
				contentType: 'review',
				feedbackType: 'inappropriate'
			}).then(() => {
				this.setState({ reportSubmitted: true })
				BvPixelTrackEvent({
					name: 'report',
					brand: brandName,
					productId: materialId,
					categoryId: categoryId,
					detail1: reviewID
				})
			})
		}
		return false
	}

	componentDidMount() {
		const { reviewID, materialId, brandName, categoryId } = this.props
		if ( window.BV ) {
			window.BV.pixel.trackImpression({
				contentId: reviewID,
				brand: brandName,
				productId: materialId,
				bvProduct: 'RatingsAndReviews',
				categoryId: categoryId,
				contentType: 'review'
			});
		}
	}

	render() {
		const { review } = this.props
		const {
			expanded,
			negativeHelpfulnessSubmitted,
			positiveHelpfulnessSubmitted,
			reportSubmitted,
			totalNegativeFeedbackCount,
			totalPositiveFeedbackCount
		} = this.state
		const {
			IsRecommended,
			Rating,
			ReviewText,
			SubmissionTime,
			Title,
			UserNickname
		} = review

		return (
			<div>
				<div className="c-review">
					<div>
						<Stars rating={Rating} />
						<Content
              SubmissionTime={SubmissionTime}
							expanded={expanded}
							isRecommended={IsRecommended}
							reviewText={ReviewText}
							showMoreOrLessText={this.showMoreOrLessText}
							title={Title}
							userNickname={UserNickname}
						/>
						<Helpfulness
							increaseNegativeCount={this.increaseNegativeCount}
							increasePositiveCount={this.increasePositiveCount}
							negativeHelpfulnessSubmitted={negativeHelpfulnessSubmitted}
							positiveHelpfulnessSubmitted={positiveHelpfulnessSubmitted}
							reportSubmitted={reportSubmitted}
							submitReport={this.submitReport}
							totalNegativeFeedbackCount={totalNegativeFeedbackCount}
							totalPositiveFeedbackCount={totalPositiveFeedbackCount}
						/>
					</div>
				</div>
				<div className="c-review__border" />
			</div>
		)
	}
}

Review.propTypes = {
  review: PropTypes.shape({
    SubmissionTime: PropTypes.string,
    ReviewText: PropTypes.string,
    UserNickname: PropTypes.string,
    Title: PropTypes.string,
    Rating: PropTypes.number,
    TotalPositiveFeedbackCount: PropTypes.number,
    TotalNegativeFeedbackCount: PropTypes.number,
    IsRecommended: PropTypes.bool,
  }).isRequired,
  reviewID: PropTypes.string.isRequired,
}
