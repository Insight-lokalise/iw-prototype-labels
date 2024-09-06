// table containing productLayout details
export const productLayouts = {
  singleColumn: {
    layout: 'column',
    columns: {
      mobile: 1,
      mobileLandscape: 1,
      tablet: 1,
      tabletLandscape: 1,
      desktop: 1,
    },
    lineLimit: { basic: 0, minimal: 0, single: 0 },
  },
  twoColumn: {
    layout: 'column',
    columns: {
      mobile: 2,
      mobileLandscape: 2,
      tablet: 2,
      tabletLandscape: 2,
      desktop: 2,
    },
    lineLimit: { basic: 0, minimal: 0, single: 0 },
  },
  threeColumn: {
    layout: 'column',
    columns: {
      mobile: 1,
      mobileLandscape: 1,
      tablet: 3,
      tabletLandscape: 3,
      desktop: 3,
    },
    lineLimit: { basic: 0, minimal: 3, single: 0 },
  },
  fourColumn: {
    layout: 'column',
    columns: {
      mobile: 2,
      mobileLandscape: 2,
      tablet: 2,
      tabletLandscape: 4,
      desktop: 4,
    },
    lineLimit: { basic: 3, minimal: 3, single: 0 },
  },
  fiveColumn: {
    layout: 'column',
    columns: {
      mobile: 1,
      mobileLandscape: 1,
      tablet: 1,
      tabletLandscape: 5,
      desktop: 5,
    },
    lineLimit: { basic: 3, minimal: 3, single: 0 },
  },
  sixColumn: {
    layout: 'column',
    columns: {
      mobile: 2,
      mobileLandscape: 2,
      tablet: 3,
      tabletLandscape: 3,
      desktop: 6,
    },
    lineLimit: { basic: 3, minimal: 3, single: 0 },
  },
  singleCarousel: {
    layout: 'carousel',
    columns: {
      mobile: 1,
      mobileLandscape: 1,
      tablet: 1,
      tabletLandscape: 1,
      desktop: 1,
    },
    lineLimit: { basic: 0, minimal: 0, single: 0 },
  },
  fiveCarousel: {
    layout: 'carousel',
    columns: {
      mobile: 1,
      mobileLandscape: 2,
      tablet: 3,
      tabletLandscape: 4,
      desktop: 5,
    },
    lineLimit: { basic: 3, minimal: 3, single: 0 },
  },
}
// Call to Action labels
export const ctaLabels = {
  addToCart: 'Add to cart',
  seeDetails: 'See the details',
  shopNow: 'Shop now',
  buyNow: 'Buy now',
}
