import axios, { POST } from './axiosConfig';
import getProductDetails from './getProductDetails';
import { getAccountInformation } from './getData';
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils';
import getWebPrice from '../shared/getWebPrice';

export const getRequestForThirdPartyWarranty = (product, requestData) => {
    const {
        materialId,
        salesOrg,
        locale,
        ipsUser,
        soldto,
        wg,
        webLoginProfileId,
    } = requestData;

    const listPrice = product?.price?.listPrice;
    const webPrice = product?.price?.webPrice;
    const categoryCode = product?.category?.code;
    const manufacturerRule = product?.manufacturer?.name;
    const materialQualifier = product?.materialQualifier;
    const productTypeRule = product?.productTypeRule;

    return {
        ces: true, //app-guest-checkout is for default logged-out users
        contractId: '',
        categoryCode,
        materialQualifier,
        matId: materialId,
        manufacturerRule,
        productTypeRule,
        salesOrg,
        locale,
        ipsUser,
        soldto,
        uid: webLoginProfileId,
        price: getWebPrice({ webPrice, listPrice }),
        wg,
        filterCallForPrice: false, // true will filter warranties with call for price
    };
}

/** Get Third party warranties
*
* Get product placements using the provided options
* @param {string} materialId - Unique product/material id
*
* @returns {array} array of third party warranties
*/
export const getThirdPartyWarranties = async (materialId) => {
    try {
        const {
            webGroupId: wg,
            ipsUser,
            isLoggedIn,
            locale,
            soldto,
            salesOrg,
            webLoginProfileId,
            currencyCode
        } = await getAccountInformation();

        const requestData = {
            materialId,
            salesOrg: salesOrg || getDefaultLoggedOutSalesOrg(locale, ipsUser),
            locale,
            ipsUser,
            soldto,
            wg,
            isLoggedIn,
            webLoginProfileId,
            currencyCode
        };

        const { product } = await getProductDetails(requestData);

        const request = getRequestForThirdPartyWarranty(product, requestData);
        const { data } = await axios({
            method: POST,
            url: '/insightweb/getWarranty',
            data: request,
        });
        return data;
    } catch (err) {
        console.warn(`Failed to fetch 3rd party warranties: `, err);
        return [];
    }
}

// Format Third party warranties to be consumed in presentation components
export const convertToProductWarranty = (item) => {
    const {
        images,
        price: itemPrice,
        materialId,
        manufacturer,
        descriptions,
    } = item;
    return {
      productURL: '',
      materialId,
      manuFacturerName: manufacturer.name,
      manuIid: manufacturer.id,
      description: descriptions.longDescription || descriptions.shortDescription,
      price: itemPrice.productPrices[0],
      image: images.largeImage
    }
}

