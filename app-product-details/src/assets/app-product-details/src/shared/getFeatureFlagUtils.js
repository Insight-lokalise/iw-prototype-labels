// Feature flag for New Web pricing
export const getWebPricingFeatureFlag = () => window.flags && window.flags['GNA-11926-NEW-WEB-PRICING'];

// Feature flag for Reviews and Ratings
export const getReviewsAndRatingsFeatureFlag = () => window.flags && window.flags['GNA-13095-REVIEWS-AND-RATINGS'];