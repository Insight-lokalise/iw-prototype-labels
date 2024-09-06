import axios from 'axios'
import processTitle from '../common/processTitle'

/**
 * Fetch the product information, given an insight number/identifier.
 */

const getProductInfo = async (insightNumber) => {
  const locale = 'en_US'
  const endpoint = '/getProductInfo'
  const data = {
    locale,
    similarMaterialId: insightNumber
  }

  return axios
    .post(endpoint, data)
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
function processResponse({ webProduct }) {
  const { title, subtitle } = processTitle(product.description)

  return {
    title,
    subtitle,
    description: webProduct.longDescription,
    category: {
      id: webProduct.categoryId,
      label: webProduct.categoryLabel,
      url: null,
    },
    brand: webProduct.manufacturerDetails.name,
    model: webProduct.modelName,
    weight: null,
    insightNumber: webProduct.materialId,
    manufacturerNumber: webProduct.manufacturerPartNumber,
    classification: [
      {
        scheme: 'UNSPSC',
        value: webProduct.unspscCode
      }
    ],
    manufacturer: {
      id: webProduct.manufacturerDetails.id,
      name: webProduct.manufacturerDetails.name,
      image: {
        large: webProduct.image.manufacturerLargeImage,
        small: webProduct.image.manufacturerSmallImage,
      },
    },
    metadata: null,
    isApproved: null,
    hasSellRequirements: null,
    availability: null,
    rebate: null,
    images: [
      {
        large: webProduct.image.largeImage,
        small: webProduct.image.smallImage,
      }
    ],
    specifications: null,
    promotions: null,
  }
}
