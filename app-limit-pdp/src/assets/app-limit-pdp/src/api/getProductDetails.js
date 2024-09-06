import axios, { POST } from './axios'

let cachedProductDetailsResponse = {};
// caching product details, using material id as key
export const getProductDetailsCachedData = async (data) => {
  const materialId = data?.materialId;
  if(cachedProductDetailsResponse[materialId]) {
    return cachedProductDetailsResponse[materialId];
  }

  return await getProductDetails(data);
}

/** Get Product Details API
 *
 * Get product details using the provided options
 * @param {string} locale - User locale
 * @param {string} materialId - Unique product id
 * @param {string} salesOrg
 * @param {boolean=} includeSpecifications
 */
export const getProductDetails = async ({
  locale,
  materialId,
  salesOrg,
  includeSpecifications = true,
  includeVariants = false,
}) => {
  try {
    const { data } = await axios({  
      method: POST,
      url: '/api/product-management/product',
      data: {
        locale,
        materialId: decodeURIComponent(materialId),
        includeSpecifications,
        includeVariants,
        limitedPDP: true,
        salesOrg,
      },
    })
    if (!data.product) throw new Error('Error finding product')
    cachedProductDetailsResponse[materialId] = data;
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch product details`, err)
    throw err
  }
}

export default getProductDetails
