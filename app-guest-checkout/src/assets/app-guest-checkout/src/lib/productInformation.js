import { DEFAULT_IMAGE, IMAGE_SIZES } from "../constants";
import getWebPrice from "../shared/getWebPrice";
import { getAppropriateProductPrice, productImageToRender } from "@insight/toolkit-utils";
/**
 * Get Product Information
 */
export const getProductInfo = (isRecommendedProduct, item, isLoggedIn) => {
    return isRecommendedProduct ? getRecommendedProductInfo(item, isRecommendedProduct) : getRecentlyViewedProductInfo(item, isLoggedIn);
}

/**
 * Get Product Information for recently viewed products
 */
const getRecentlyViewedProductInfo = (item, isLoggedIn) => {
    const { materialId, images, descriptions, manufacturer } = item;
    const { webPrice, listPrice, insightPrice, callForPrice, currency } = item?.price || {};
    const product = {
        currency,
        imgURL: productImageForRecentlyViewed(images),
        materialId,
        mfrId: manufacturer?.partNumber,
        name: productDescriptionForRecentlyViewed(descriptions),
        price: getWebPrice({ webPrice, insightPrice, listPrice, isLoggedIn }),
        isCallForPrice: callForPrice,
      }

    return product;
}

/**
 * Get Product Information for recommended products
 */
const getRecommendedProductInfo = (item,isRecommendedProduct) => {
    const {
        image,
        webProduct,
        price,
        materialId, 
        manufacturerPartNumber, 
        description, 
        callForPrice, 
        prices,
        contractDisplayInfo} = item;
    const itemImage = typeof image === 'string'? image : productImageToRender(image);
    const isWebProduct = !!webProduct || !isRecommendedProduct;
    const itemPrice = isWebProduct ? getAppropriateProductPrice(prices, contractDisplayInfo): price;
    const product = {
      currency: itemPrice.currency,
      imgURL: itemImage,
      materialId,
      mfrId: manufacturerPartNumber,
      name: description,
      price: itemPrice.price,
      isCallForPrice: callForPrice,
    }
    return product;
}

const productDescriptionForRecentlyViewed = (descriptions) => {
    const { shortDescription, customerDescription, longDescription } = descriptions || {};
    const description = shortDescription || customerDescription || longDescription || '';
    return description;
}

const productImageForRecentlyViewed = (productImages) => {
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