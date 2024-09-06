import axios, { GET, POST } from "./axiosConfig";

import {
  i18n,
  getCurrentLocale,
  getUTCTimeStamp,
} from "@insight/toolkit-utils";

export function fetchInitialData() {
  return axios({
    method: GET,
    url: `cs/enduser-init`,
  }).catch((error) => {
    console.warn(`Failed to fetch initial load`, error);
  });
}

export function fetchSearchResults({ searchString, locale }) {
  return axios({
    method: POST,
    url: `cs/search`,
    data: { q: searchString, lang: locale },
  }).catch((error) => {
    console.warn(`Failed to fetch search results`, error);
    throw error;
  });
}

export function fetchProductSets({ locale, productGroupId }) {
  return axios({
    method: GET,
    url: "cs/endUser/productSets",
    params: { locale, productGroupId },
  }).catch((error) => {
    console.warn(`Failed to fetch product sets`, error);
    throw error;
  });
}

export function fetchProductInformation({ contractId, locale, materialId }) {
  return axios({
    method: GET,
    url: `cs/endUser/productInformation`,
    params: { contractId, locale, matId: materialId },
  }).catch((error) => {
    console.warn(`Failed to fetch PDP information`, error);
    throw error;
  });
}

export function addProductGroupItemsToCart({ productGrpId, language, qty }) {
  /* For testing use this productGrpId - B84CDDD9-3AA3-43BE-8226-6A0ED4025697 */
  return axios({
    method: POST,
    url: `cs/productGroups/${productGrpId}/routine`,
    params: { lang: language, qty },
  }).catch((error) => {
    console.warn(`Failed to add productGroup items to cart`, error);
    throw error;
  });
}

export function addProductSetsToCart({
  bundleQuantity,
  cart,
  language,
  productGroupId,
  contractId,
}) {
  return axios({
    method: POST,
    url: `cs/addBundleToCart`,
    data: {
      clientBrowserDate: getUTCTimeStamp(),
      bundleQty: bundleQuantity,
      lang: language,
      productGroupId,
      contractId,
      selectedItems: cart,
    },
  }).catch((error) => {
    console.warn(`Failed to add productGroup items to cart`, error);
    throw error;
  });
}

export function getCartItemCount() {
  const timestamp = new Date().getTime();
  return axios
    .get(`/cartItemCount?_=${timestamp}`)
    .catch((error) => {
      console.warn("Failed to fetch cart data", error);
      throw error;
    })
    .then(({ data }) => data.quantity);
}
