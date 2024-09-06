
// Format Third party warranties to be consumed in presentation components
export const formatToProtectionPlan = (item) => {
    return {
        productURL: '',
        materialId: item.materialId,
        manuFacturerName: item.manufacturer?.name,
        manufacturerPartNumber: item.manufacturer?.partNumber,
        manuIid: item.manufacturer?.id,
        name: item.descriptions?.shortDescription,
        price: item.price?.productPrices?.[0],
        image: item.images?.largeImage,
    }
}

// Combine Manufacturer warranties and Third party warranties
export const getWarrantyMaterialIds = (protection, thirdPartyProtection) => {
    const protectionList = protection?.prodList || [];
    const thirdPartyProtectionList = thirdPartyProtection || [];
    const combinedList = [...protectionList, ...thirdPartyProtectionList];
    // Get the list of protection plan ids
    return combinedList?.map((plan) => plan.materialId) || [];
  }
