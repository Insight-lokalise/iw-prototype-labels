import { pdpGAE } from '@insight/toolkit-utils'

export const sendTracking = async ({ product }, data) => {
  // Generate pdp tracking object
  const item = {
    currency: product?.price?.currency,
    brand: product?.manufacturer?.name,
    category: product?.category?.code,
    manufacturerPartNumber: product?.manufacturer?.partNumber,
    insightPartId: product?.materialId,
    name: product?.descriptions?.shortDescription,
    price: product?.price?.insightPrice,
    ...data,
  }
  // Send Tracking
  pdpGAE(item)
}

export default sendTracking
