import { getInObject } from '@insight/toolkit-utils'

export function selector_ratingsAndReviews(state) {
  return getInObject(state, 'reviews', {})
}

export function selector_reviewFilters(state) {
  return getInObject(state, 'reviewFilters', {})
}

export const selector_reviews = state => selector_ratingsAndReviews(state).Results || []
export const selector_defaultReviewCount = state => selector_ratingsAndReviews(state).Limit || 5
export const selector_totalReviews = state => selector_ratingsAndReviews(state).TotalResults || 0
export const selector_hasErrors = state => selector_ratingsAndReviews(state).HasErrors || false
export const selector_errorList = state => selector_ratingsAndReviews(state).Errors || []
export const selector_isLoading = state => selector_ratingsAndReviews(state).isLoading || false
export const selector_hasFailed = state => selector_ratingsAndReviews(state).hasFailed || false
export const selector_sortBy = state => selector_ratingsAndReviews(state).sortBy || 'SubmissionTime:desc'

export const selector_rnrIncludes = state => selector_ratingsAndReviews(state).Includes || {}
export function selector_materialId(state) {
  const includes = selector_rnrIncludes(state)
  return includes.ProductsOrder ? includes.ProductsOrder[0] : []
}

export function selector_productDetail(state) {
  const includes = selector_rnrIncludes(state)
  return includes.Products ? includes.Products[selector_materialId(state)] : {}
}

export const selector_categoryId = state => selector_productDetail(state).CategoryId || $('[itemprop="category-id"]').attr("content")
export const selector_brand = state => selector_productDetail(state).Brand || {}
export const selector_brandName = state => selector_brand(state).Name || $('[itemprop="brand"]').attr("content")

export const selector_reviewStatistics = state => selector_productDetail(state).FilteredReviewStatistics || {}
export const selector_recommendedReviewCount = state => selector_reviewStatistics(state).RecommendedCount || 0
export const selector_notRecommendedReviewCount = state => selector_reviewStatistics(state).NotRecommendedCount || 0
export const selector_overallRating = state => selector_reviewStatistics(state).AverageOverallRating || 0
export const selector_ratingDistribution = state => selector_reviewStatistics(state).RatingDistribution || []
export const selector_totalReviewCount = state => selector_reviewStatistics(state).TotalReviewCount || 0

export function selector_ratingStatistics(state){
  const ratingDistribution = selector_ratingDistribution(state)
  const ratingObject = {}
  ratingDistribution.forEach(({RatingValue, Count})=>{
    ratingObject[RatingValue] = Count;
  })
  return ratingObject
}

export function selector_reviewSubmissionForm(state) {
  return getInObject(state, 'submissionForm', {})
}

export const selector_submissionForm = state => selector_reviewSubmissionForm(state).Data || {}

export const selector_submissionFormFields = state => selector_submissionForm(state).Fields || {}

export function selector_user(state) {
  return getInObject(state, 'user', {})
}

export const selector_isLoggedIn = state => selector_user(state).isLoggedin || false
export const selector_b2bLoginInfo = state => selector_user(state).b2bLoginInfo || {}
export const selector_userInformation = state => selector_user(state).userInformation || {}
export function selector_isSharedUser(state) {
    const userInformation = selector_userInformation(state)
    return getInObject(userInformation, ['UserType'], 'Standard') === 'Shared'
}
export const selector_isB2BUser = state => selector_b2bLoginInfo(state).isB2BUser || false
