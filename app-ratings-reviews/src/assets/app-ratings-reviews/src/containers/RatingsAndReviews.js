import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  getRatingsAndReviewsList,
  getRatingsAndReviewsListOnSort,
  getReviewSubmissionForm,
  selector_brandName,
  selector_categoryId,
  selector_defaultReviewCount,
  selector_errorList,
  selector_hasErrors,
  selector_hasFailed,
  selector_isB2BUser,
  selector_isLoading,
  selector_isLoggedIn,
  selector_notRecommendedReviewCount,
  selector_overallRating,
  selector_ratingStatistics,
  selector_recommendedReviewCount,
  selector_reviews,
  selector_sortBy,
  selector_submissionFormFields,
  selector_totalReviews,
} from '../duck'

import RatingsAndReviewsView from '../components/RatingsAndReviewsView'

const mapStateToProps = state => ({
    averageRating : selector_overallRating(state),
    brandName : selector_brandName(state),
    categoryId : selector_categoryId(state),
    defaultCount: selector_defaultReviewCount(state),
    errors: selector_errorList(state),
    hasErrors: selector_hasErrors(state),
    hasFailed: selector_hasFailed(state),
    isB2BUSer: selector_isB2BUser(state),
    isLoggedin: selector_isLoggedIn(state),
    isLoading : selector_isLoading(state),
    notRecommendedReviewCount: selector_notRecommendedReviewCount(state),
    recommendedReviewCount: selector_recommendedReviewCount(state),
    ratingDistribution: selector_ratingStatistics(state),
    reviews: selector_reviews(state),
    sortBy: selector_sortBy(state),
    submissionFormFields: selector_submissionFormFields(state),
    totalReviews: selector_totalReviews(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getRatingsAndReviewsList,
  getRatingsAndReviewsListOnSort,
  getReviewSubmissionForm,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RatingsAndReviewsView)
