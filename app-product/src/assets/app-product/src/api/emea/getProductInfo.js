import axios from 'axios'
import processTitle from '../common/processTitle'

/**
 * Fetch the product information, given an insight number/identifier.
 */
const getProductInfo = async (insightNumber) => {
  const siteId = window.siteEntity
  const customerId = window.appUserService.contactId
  const locale = 'en_GB'
  const currencyCode = 'GBP'
  const endpoint = `/api/product-info/v1/sites/${siteId}/customers/${customerId}/${locale}?insightNumber=${insightNumber}&currencyCode=${currencyCode}`
  
  return axios
    .get(endpoint)
    .catch(error => {
      console.warn('Failed to fetch product info', error)
      throw error
    })
    .then(processResponse)
}

export default getProductInfo


/**
 * Process the service response into the format expected by the app.
 */
function processResponse({ data: product }) {
  const { title, subtitle } = processTitle(product.title)

  return {
    title,
    subtitle,
    description: product.description,
    category: {
      label: product.category,
      id: product.categoryId,
      url: product.categoryURL
    },
    brand: product.brand,
    model: null,
    weight: product.weight,
    insightNumber: product.insightNumber,
    manufacturerNumber: product.manufacturerNumber,
    classification: product.classification,
    manufacturer: {
      id: product.manufacturer.id,
      name: product.manufacturer.name,
      image: null,
    },
    metadata: null,
    isApproved: null,
    hasSellRequirements: null,
    availability: null,
    rebate: null,
    images: [
      {
        extraLarge: product.images.extraLargeURL,
        medium: product.images.mediumURL,
        large: product.images.largeURL,
        small: product.images.smallURL,
      }
    ],
    specifications: processSpecifications(product.specification),
    promotions: null
  }
}


/**
 * Process the specifications into the formation expected by the app.
 */
function processSpecifications(specifications) {
  return specifications
}
