import { pdpGAE } from '@insight/toolkit-utils';
import { getWebPricingFeatureFlag } from '../shared';

export const sendTracking = async ({ product }, data) => {
  const newWebPriceFeature = getWebPricingFeatureFlag();
  // Generate pdp tracking object
  const item = {
    currency: product?.price?.currency,
    brand: product?.manufacturer?.name,
    category: product?.category?.code,
    manufacturerPartNumber: product?.manufacturer?.partNumber,
    insightPartId: product?.materialId,
    name: product?.descriptions?.shortDescription,
    price: newWebPriceFeature
      ? product?.price?.webPrice
      : product?.price?.insightPrice,
    ...data,
  }
  // Send Tracking
  pdpGAE(item)
}

export default sendTracking
