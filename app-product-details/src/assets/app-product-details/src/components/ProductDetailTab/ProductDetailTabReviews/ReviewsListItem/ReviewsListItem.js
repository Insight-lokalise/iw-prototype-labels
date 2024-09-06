import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ReviewsListItemContent } from './ReviewsListItemContent'
import { ReviewsListItemStars } from './ReviewsListItemStars'
import { ReviewsListItemFooter } from './ReviewsListItemFooter'

export const ReviewsListItem = (props) => {
  const [state, setState] = useState({
    expanded: false,
    negativeHelpfulnessSubmitted: false,
    positiveHelpfulnessSubmitted: false,
    reportSubmitted: false,
    totalPositiveFeedbackCount: props.review.TotalPositiveFeedbackCount,
    totalNegativeFeedbackCount: props.review.TotalNegativeFeedbackCount,
  })

  const handleFeedbackSubmission = (feedbackType, vote) =>
    props.submitReviewFeedback({
      contentId: props.review.Id,
      contentType: 'review',
      feedbackType,
      vote,
    })

  const increaseNegativeCount = async () => {
    if (
      state.positiveHelpfulnessSubmitted ||
      state.negativeHelpfulnessSubmitted
    )
      return
    await handleFeedbackSubmission('helpfulness', 'Negative')
    setState({
      ...state,
      negativeHelpfulnessSubmitted: true,
      totalNegativeFeedbackCount: state.totalNegativeFeedbackCount + 1,
    })
  }
  const increasePositiveCount = async () => {
    if (
      state.positiveHelpfulnessSubmitted ||
      state.negativeHelpfulnessSubmitted
    )
      return null
    await handleFeedbackSubmission('helpfulness', 'Positive')
    setState({
      ...state,
      positiveHelpfulnessSubmitted: true,
      totalPositiveFeedbackCount: state.totalPositiveFeedbackCount + 1,
    })
    return null
  }
  const showMoreOrLessText = () =>
    setState({ ...state, expanded: !state.expanded })
  const submitReport = async () => {
    if (state.reportSubmitted) return null
    await props.submitReviewFeedback({
      contentId: props.review.Id,
      contentType: 'review',
      feedbackType: 'inappropriate',
    })
    setState({ ...state, reportSubmitted: true })
    return null
  }
  const {
    IsRecommended,
    Rating,
    ReviewText,
    SubmissionTime,
    Title,
    UserNickname,
  } = props.review

  return (
    <section className="c-reviews__list__item">
      <ReviewsListItemStars rating={Rating} />
      <ReviewsListItemContent
        SubmissionTime={SubmissionTime}
        expanded={state.expanded}
        reviewText={ReviewText}
        showMoreOrLessText={showMoreOrLessText}
        title={Title}
        userNickname={UserNickname}
      />
      <ReviewsListItemFooter
        isRecommended={IsRecommended}
        increaseNegativeCount={increaseNegativeCount}
        increasePositiveCount={increasePositiveCount}
        negativeHelpfulnessSubmitted={state.negativeHelpfulnessSubmitted}
        positiveHelpfulnessSubmitted={state.positiveHelpfulnessSubmitted}
        reportSubmitted={state.reportSubmitted}
        submitReport={submitReport}
        totalNegativeFeedbackCount={state.totalNegativeFeedbackCount}
        totalPositiveFeedbackCount={state.totalPositiveFeedbackCount}
      />
    </section>
  )
}

export default ReviewsListItem

ReviewsListItem.propTypes = {
  review: PropTypes.shape({
    Id: PropTypes.string.isRequired,
    SubmissionTime: PropTypes.string,
    ReviewText: PropTypes.string,
    UserNickname: PropTypes.string,
    Title: PropTypes.string,
    Rating: PropTypes.number,
    TotalPositiveFeedbackCount: PropTypes.number,
    TotalNegativeFeedbackCount: PropTypes.number,
    IsRecommended: PropTypes.bool,
  }).isRequired,
  submitReviewFeedback: PropTypes.func.isRequired,
}
