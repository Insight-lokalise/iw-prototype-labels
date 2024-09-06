import axios, { POST } from './axios'
import { getAsciiString } from '@insight/toolkit-utils'

/** Get Ratings And Reviews API
 *
 * Get product reviews using the provided options
 * @param {object} body - An object representing the body of the request
 * @requires body.materialId
 *
 * @returns {object} object representing the reviews struct
 */
export const getProductReviews = async (body) => {
  const { materialId } = body
  try {
    const { data } = await axios({
      method: POST,
      url: '/insightweb/reviews',
      data: body,
    })

    // Check and set error to first error in the Errors node
    if (data.HasErrors && data.Errors && data.Errors.length) {
      throw new Error(data.Errors[0]?.Message)
    }
    // Check if the response contains any reviews
    if (!data.TotalResults || !data.Results || !data.Results.length) {
      throw new Error('No reviews yet. Be the first.')
    }
    // Normalize material id to its ascii transformation
    const asciiMaterialId = getAsciiString(materialId)
    // Get top level nodes
    const product = data.Includes?.Products?.[asciiMaterialId]
    const statistics = product?.FilteredReviewStatistics || {}
    const ratingDistribution = statistics?.RatingDistribution?.reduce(
      (ratingObject, { RatingValue, Count }) => {
        ratingObject[RatingValue] = Count
        return ratingObject
      },
      {}
    )
    return {
      limit: data.Limit,
      offset: data.Offset,
      totalResults: data.TotalResults || 0,
      locale: data.Locale,
      reviews: data.Results,
      hasError: data.HasErrors,
      errors: data.Errors,
      defaultCount: data.Limit || 5,
      totalReviews: statistics.TotalReviewCount || 0,
      averageRating: statistics.AverageOverallRating || 0,
      ratingDistribution,
    }
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn('Failed to retrieve reviews', err)
    throw err
  }
}

export default getProductReviews
