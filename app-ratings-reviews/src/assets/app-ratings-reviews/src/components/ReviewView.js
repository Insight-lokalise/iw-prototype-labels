import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Date, Icon, StarRating } from '@insight/toolkit-react'
import { isMobile, t } from '@insight/toolkit-utils';
import { submitFeedback } from '../api/us'

export default class ReviewView extends Component {
  state = {
    expanded: false ,
    positiveHelpfulnessSubmitted: false,
    negativeHelpfulnessSubmitted: false,
    reportSubmitted: false,
    totalPositiveFeedbackCount: this.props.review.TotalPositiveFeedbackCount,
    totalNegativeFeedbackCount: this.props.review.TotalNegativeFeedbackCount,
  }

  increasePostiveCount = () => {
    if(!(this.state.positiveHelpfulnessSubmitted || this.state.negativeHelpfulnessSubmitted)){
      this.handleFeedbackSubmission('helpfulness','Positive').then(() => {
        this.setState({
          positiveHelpfulnessSubmitted: true,
          totalPositiveFeedbackCount: this.state.totalPositiveFeedbackCount + 1
        })
      })
    }
  }

  increaseNegativeCount = () => {
    if(!(this.state.positiveHelpfulnessSubmitted || this.state.negativeHelpfulnessSubmitted)){
      this.handleFeedbackSubmission('helpfulness','Negative').then(() => {
        this.setState({
          negativeHelpfulnessSubmitted: true,
          totalNegativeFeedbackCount: this.state.totalNegativeFeedbackCount + 1
        })
      })
    }
  }

  displayReviewText = () => {
    const { ReviewText } = this.props.review
    if (this.state.expanded) {
          return ReviewText;
    }
    return ReviewText.substr(0, 500);
  }

  handleFeedbackSubmission = (feedbackType, vote) => {
    const param = {
      contentType: 'review',
      contentId: this.props.reviewID,
      feedbackType,
      vote,
    }
    return submitFeedback(param)
  }

  showMoreOrLessText = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  submitReport = () => {
    if(!this.state.reportSubmitted){
      const param = {
        contentType: 'review',
        contentId: this.props.reviewID,
        feedbackType: 'inappropriate'
      }
      return submitFeedback(param).then(() => {
        this.setState({
      //    reported: !this.state.reported ,
          reportSubmitted: true,
        })
      })
    }
    return false
  }

  render() {
    const {
      IsRecommended,
      Rating,
      ReviewText,
      SubmissionTime,
      Title,
      UserNickname
    } = this.props.review
    const { locale } = this.props
    const { negativeHelpfulnessSubmitted, positiveHelpfulnessSubmitted, totalPositiveFeedbackCount, totalNegativeFeedbackCount } = this.state
    const viewportBasedReportText = isMobile() ? t('Report') : t('Report an issue')

    return (
      <div className='c-review o-grid'>
        <div className='c-review__item o-grid__item'>
          <div className="c-review__stars">
            <StarRating
              containerClassName='c-star-rating  c-star-rating--large  c-star-rating--static'
              rating={Rating}
              showAverage
              stars={5}
            />
          </div>
          <div className="c-review__content">
            <h4 className="c-review__title">{Title}</h4>
            <p className="c-review__text">{this.displayReviewText()}</p>
            {ReviewText.length > 500  && <span><Button color='link' onClick={this.showMoreOrLessText}>{t('Show more')}<Icon icon={this.state.expanded ? 'arrow-dropup' : 'arrow-dropdown'} /></Button></span>}
            <p className="c-review__user">{UserNickname} - <span className="c-review__date"><Date date={SubmissionTime} /></span></p>
            {IsRecommended ?
              <p className="c-review__recommended">
                <Icon icon="checkmark-circled" type="success" />
                <span>{t('Yes, I recommend this product.')}</span>
              </p> :
              <p className="c-review__recommended">
                <Icon icon="close-circled" type="error" />
                <span>{t(`No, I don't recommend this product.`)}</span>
              </p>
            }
            <div className='c-review__helpfulness o-grid'>
              <p className="o-grid__item u-hide@desktop">{t('Helpful?')}</p>
              <p className="o-grid__item u-show@desktop u-1/3@desktop">{t('Was this review helpful?')}</p>
              <Button
                className={cn('o-grid__item', {
                  'is-clicked': positiveHelpfulnessSubmitted
                })}
                color="link"
                onClick={this.increasePostiveCount}
              >
                {t('Yes - ')}{totalPositiveFeedbackCount}
              </Button>
              <Button
                className={cn('o-grid__item', {
                  'is-clicked': negativeHelpfulnessSubmitted
                })}
                color="link"
                onClick={this.increaseNegativeCount}
              >
                {t('No - ')}{totalNegativeFeedbackCount}
              </Button>
              <Button className="o-grid__item u-1/3@desktop" color="link" onClick={this.submitReport}>
                {this.state.reportSubmitted ? t('Reported') : (
                  <Fragment>
                    <span className="u-hide@desktop">{t('Report')}</span>
                    <span className="u-show@desktop">{t('Report an issue')}</span>
                  </Fragment>
                )}
              </Button>
            </div>
          </div>
          <div className="c-review__border" />
        </div>
      </div>
    )
  }
}

ReviewView.propTypes = {
  locale: PropTypes.string.isRequired,
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
