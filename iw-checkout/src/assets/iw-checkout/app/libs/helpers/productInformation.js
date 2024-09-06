import { DEFAULT_IMAGE, IMAGE_SIZES } from "../constants";
import { getAppropriateProductPrice, productImageToRender } from "../../../libs/models/Products";

/**
 * Get Product Information
 * Price info, description, image
 */
export const getProductInfo = (item, isCesOrDefaultLoggedOut) => {
    return isCesOrDefaultLoggedOut ?
          getProductInfoForCES(item) :
          getProductInfoForLegacy(item);
}

/**
 * Get Product Information for Legacy
 */
const getProductInfoForLegacy = (item) => {
    const { materialId, prices, contractDisplayInfo, image, customDescription, description } = item;
    const itemPricing = getAppropriateProductPrice(prices, contractDisplayInfo);
    return {
        materialId,
        itemPricing,
        itemImage: productImageToRender(image),
        isCallForPrice: itemPricing?.priceLabel === 'CALLFORPRICELABEL',
        itemDescription: customDescription || description
    }
}

/**
 * Get Product Information for CES and Default Logged out
 */
const getProductInfoForCES = (item) => {
    const { materialId, images, descriptions } = item;
    
    const { webPrice, webPriceInclVat, callForPrice } = item?.price || {};
    return {
        materialId,
        itemPricing: {
            ...item?.price,
            price: webPrice,
            priceInclVat: webPriceInclVat,
        },
        itemImage: productImageToRenderForCES(images),
        isCallForPrice: callForPrice,
        itemDescription: productDescriptionForCES(descriptions)
    }
}

const productDescriptionForCES = (descriptions) => {
    const { shortDescription, customerDescription, longDescription } = descriptions || {};
    const description = shortDescription || customerDescription || longDescription || '';
    return description;
}

const productImageToRenderForCES = (productImages) => {
    function isValidImage(value) {
        return !!value && value !== 'image.not.available'
    }

    const { SM, MD, LG } = IMAGE_SIZES;
    // find object that contains primary images
    const primaryImageObj = productImages?.find((item) => {
        const images = item.images;
        const firstItem = images[MD] || images[LG] || images[SM];
        return firstItem?.[0]?.primary;
    });

    const images = primaryImageObj?.images;
    const mdImage = images?.[MD]?.[0]?.url;
    const lgImage = images?.[LG]?.[0]?.url;
    const smImage = images?.[SM]?.[0]?.url;

    if (isValidImage(mdImage)) {
        return mdImage;
    } else if (isValidImage(lgImage)) {
        return lgImage;
    } else if (isValidImage(smImage)) {
        return smImage;
    } else {
        return DEFAULT_IMAGE;
    }
};