import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  getRatingsAndReviewsList,
  getRatingsAndReviewsListOnSort,
  selector_brandName,
  selector_categoryId,
  selector_defaultReviewCount,
  selector_isB2BUser,
  selector_isLoggedIn,
  selector_isSharedUser,
  selector_overallRating,
  selector_totalReviewCount,
  selector_reviews,
  selector_ratingStatistics,
  selector_sortBy,
  selector_totalReviews,
} from '../duck'

import CustomerReviewsView from '../components/CustomerReviewsView'

const mapStateToProps = state => ({
    averageRating : selector_overallRating(state),
    brandName : selector_brandName(state),
    categoryId : selector_categoryId(state),
    defaultCount: selector_defaultReviewCount(state),
    isB2BUSer: selector_isB2BUser(state),
    isLoggedin: selector_isLoggedIn(state),
    isSharedUser: selector_isSharedUser(state),
    reviews: selector_reviews(state),
    ratingDistribution: selector_ratingStatistics(state),
    sortBy: selector_sortBy(state),
    totalReviewsByRating: selector_totalReviews(state),
    totalReviews: selector_totalReviewCount(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getRatingsAndReviewsList,
  getRatingsAndReviewsListOnSort,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CustomerReviewsView)
