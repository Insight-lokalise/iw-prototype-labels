import axios, { POST } from './axiosConfig';

/** Get Product Details API
 *
 * Get product details using the provided options
 * @param {Object} params - parameters
 */
export const getProductDetails = async ({
  locale,
  materialId,
  salesOrg,
  soldTo,
  currencyCode,
  includeSpecifications = false,
  includeVariants = false,
}) => {
  try {
    const { data } = await axios({
      method: POST,
      url: '/gapi/product-management/product',
      data: {
        locale,
        materialId: decodeURIComponent(materialId),
        salesOrg,
        includeSpecifications,
        includeVariants,
        soldTo,
        currencyCode,
      },
    });
    if (!data.product) console.warn('There is no matched product found');
    return data;
  } catch (err) {
    console.warn(`Failed to fetch product details`, err);
  }
}

export default getProductDetails;
