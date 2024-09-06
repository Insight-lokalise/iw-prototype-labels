import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils';
import { Button, Icon, Loading } from '@insight/toolkit-react'
import { getElementOffset, scrollTo, BvPixelTrackEvent } from '../lib'

import AverageRating from './CustomerReviews/AverageRating'
import ReviewPanelTitle from './CustomerReviews/ReviewPanelTitle'
import Statistics from './CustomerReviews/Statistics'
import Review from './Review/Review'


export default class CustomerReviewsView extends Component {
	state = {
		limit: 5,
		rating: 0,
		sortBy: this.props.sortBy,
		text: t('Most recent'),
  	}

  	scrollToReviewsStart() {
       const rootElement = document.getElementById('react-app-ratings-reviews')
       const headerElement = document.getElementById('iw-header')
       const {top:headerTop} = getElementOffset(headerElement)
       const headerHeight = headerTop + headerElement.scrollHeight;
       const { left, top } = getElementOffset(rootElement)
       scrollTo({ left, top: top - headerHeight - 20 })
  	}

	showMore = (count) => {
		this.setState({ limit: count })
		const {getRatingsAndReviewsList, itemInfo, locale, brandName, categoryId } = this.props
		const { materialId } = itemInfo
		const { rating, sortBy } = this.state
		const param = {
			locale,
			materialId,
			sortBy,
			limit: count,
			...rating > 0 && {rating},
		}
		getRatingsAndReviewsList(param)

		BvPixelTrackEvent({
            name: 'paginate',
            brand: brandName,
            productId: materialId,
            categoryId: categoryId,
            detail1: 'showMore',
			detail2: count
        })
	}

	sortByOptions = (value, text) => () => {
		this.setState({ sortBy: value, text, rating: 0 })
		const {getRatingsAndReviewsList, itemInfo, locale, brandName, categoryId } = this.props
		const { materialId } = itemInfo
		const param = {
			locale,
			materialId,
			sortBy: value,
			limit: 5,
		}
		getRatingsAndReviewsList(param)

		BvPixelTrackEvent({
            name: 'sort',
            brand: brandName,
            productId: materialId,
            categoryId: categoryId,
            detail1: text
        })
  	}

	renderReviews = (starCount) => {
		this.setState({ rating: starCount })
		const {getRatingsAndReviewsListOnSort, itemInfo, locale, brandName, categoryId } = this.props
		const { materialId } = itemInfo
		const { limit, sortBy } = this.state
		const param = {
			locale,
			materialId,
			sortBy,
			limit,
			rating: starCount,
		}
		getRatingsAndReviewsListOnSort(param)

		BvPixelTrackEvent({
            name: 'filter',
            brand: brandName,
            productId: materialId,
            categoryId: categoryId,
            detail1: 'stars',
			detail2: starCount
        })
	}

	componentDidMount() {
		const {
			averageRating,
			brandName,
			categoryId,
			itemInfo,
			totalReviews
		} = this.props
		const { materialId } = itemInfo

		// BV Analytics Events
		if ( window.BV ) {
			// Object containing specific data for analytics events
			const inViewData = {
				bvProduct: 'RatingsAndReviews',
				productId: materialId,
				brand: brandName
			};

			// Object containing other PDP data and rating/review data
			const productAndRatingData = {
				type: 'Product',
				categoryId: categoryId,
				rootCategoryId: categoryId,
				numReviews: totalReviews,
				avgRating: Math.round(averageRating * 10) / 10 // Round average rating to 1 decimal place
			};

			// Merge properties into single object
			const pageViewData = {...inViewData, ...productAndRatingData};

			// Triggers an event which communicates data specific to the PDP
			window.BV.pixel.trackPageView(pageViewData);

			// Triggers an analytics event once 250 pixels of the 'react-app-ratings-reviews' container are in the viewport.
			window.BV.pixel.trackInView(inViewData, {
				minPixels: 250,
				containerId: 'react-app-ratings-reviews'
			})

			// Triggers an analytics event once 250 pixels of the 'react-app-ratings-reviews' container are in the browser viewport and has been visible for 2500 ms.
			window.BV.pixel.trackViewedCGC(inViewData, {
				minPixels: 250,
				minTime: 2500,
				containerId: 'react-app-ratings-reviews'
			})
		}

		$('#js-product-detail-target').on('click', '.js-ratings-reviews', function() {
			BvPixelTrackEvent({
				name: 'link',
				brand: brandName,
				productId: materialId,
				categoryId: categoryId,
				detail1: 'review_count',
				detail2: 'PrimaryRatingSummary'
			})
		});
	}

	render() {
		const {
			averageRating,
			brandName,
			categoryId,
			defaultCount,
			isB2BUSer,
			isLoading,
			isLoggedin,
			isSharedUser,
			itemInfo,
			locale,
			openSubmissionFormModal,
			reviews,
			ratingDistribution,
			totalReviewsByRating,
			totalReviews
		} = this.props
		const { materialId } = itemInfo
		const isUserAllowedToReview = isB2BUSer || isSharedUser
		const renderedReviewCount = totalReviewsByRating > defaultCount ? defaultCount : totalReviewsByRating
		const hasReviews = totalReviews > 0
		const hasMultipleReviews = totalReviews > 1

    	return (
        isLoading ? <Loading size="large" /> :
			<Fragment>
	        <div className='c-panel c-average-panel'>
            <div className="o-grid c-reviews-header">
              <div className="o-grid__item u-1/1 u-1/3@tablet">
                <h3 className="c-reviews-header__label">{t('Customer reviews')}</h3>
              </div>
              <div className="o-grid__item u-1/1 u-2/3@tablet c-reviews-header__leave-review">
                {isLoggedin ?
                  !isUserAllowedToReview && <Button className="c-average-panel__button" color='secondary' onClick={openSubmissionFormModal}>{t('Leave a review')}</Button>
                  : <span>
                      {t('You must be logged in to leave a review.')}<br />
                      <Button color='link' href='/insightweb/login'>{t('Login now')}</Button>
                    </span>
                }
              </div>
            </div>


            {hasReviews && (
              <div className="c-average-rating">
                <AverageRating averageRating={averageRating} onClick={()=>this.renderReviews(null)} />
                <Statistics
                  ratingDistribution={ratingDistribution}
                  renderReviews={this.renderReviews}
                  totalReviews={totalReviews}
                />
              </div>
            )}
				</div>
				<div className='c-review-panel c-panel'>
					<ReviewPanelTitle
						filterText={this.state.text}
						hasMultipleReviews={hasMultipleReviews}
						sortByOptions={this.sortByOptions}
						totalReviewsByRating={totalReviewsByRating}
					/>
					{hasReviews && reviews.map(review => (
						<Review
							key={review.Id}
							locale={locale}
							review={review}
							reviewID={review.Id}
							brandName={brandName}
							categoryId={categoryId}
							materialId={materialId}
						/>
					))}
					{hasReviews ?
					<div className='c-reviews__footer o-grid o-grid--justify-between'>
            <p className="o-grid__item">{renderedReviewCount}{` ${t('of')} `}{totalReviewsByRating}{` ${t('Reviews')}`}</p>
						<Button className="o-grid__item u-show@tablet  o-grid__item--shrink" color="link" onClick={this.scrollToReviewsStart}>{t('Back to top')}</Button>
						{!(renderedReviewCount === totalReviewsByRating) && (
							<Button
								className="o-grid__item"
								color="link"
								onClick={() => this.showMore(defaultCount + 5)}
							>
								{t('Show more')} <Icon icon={'arrow-dropdown'} />
							</Button>
						)}
					</div>
					: <div className="c-review__empty">{t('No reviews yet. Be the first.')}</div>}
				</div>
			</Fragment>
        )
    }
}


CustomerReviewsView.propTypes = {
	averageRating: PropTypes.number,
	brandName: PropTypes.string,
	categoryId: PropTypes.string,
	defaultCount: PropTypes.number,
	getRatingsAndReviewsList: PropTypes.func.isRequired,
	isB2BUSer: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
	isLoggedin: PropTypes.bool.isRequired,
	isSharedUser: PropTypes.bool.isRequired,
	itemInfo: PropTypes.shape({
    description: PropTypes.string,
    imageURL: PropTypes.string,
		materialId: PropTypes.string,
  }).isRequired,
	locale: PropTypes.string.isRequired,
	openSubmissionFormModal: PropTypes.func,
	ratingDistribution: PropTypes.shape({
    /* key value pairs */
  }),
  reviews: PropTypes.arrayOf(PropTypes.object),
	sortBy: PropTypes.string.isRequired,
	totalReviews: PropTypes.number.isRequired,
	totalReviewsByRating: PropTypes.number.isRequired
}

CustomerReviewsView.defaultProps ={
	averageRating: 0,
	defaultCount: 5,
	ratingDistribution: {},
  reviews: [],
}
