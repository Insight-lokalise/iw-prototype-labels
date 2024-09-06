import { post } from '../fetch';
import find from 'lodash-es/find';
import {callRichRelevanceRecommondations} from './recommendations';
import { RR_PLACEMENT_IDS } from '../../../app/libs/constants';

const { rr_warranties, rr_warranties_qa } = RR_PLACEMENT_IDS;


const _compareProductRequest = {
    materialIds: [],
    fromCart: true,
};

/**
 * Porduct info service call to fetch warranties
 * @param  {[type]} materialID         [description]
 * @param  {[type]} contractId         [description]
 * @param  {[type]} warranties [description]
 * @return {[type]}                    [description]
 */
export function fetchWarrantyData({ materialID, contractID = null, richRelavanceAPI }) {
    const body = Object.assign({}, _compareProductRequest, {
        materialIds: [materialID],
        contractId: contractID === '' ? null : contractID,
    })
    const cartWarrPlacementId = richRelavanceAPI.includes('integration') ? rr_warranties_qa : rr_warranties;
    const RRRequest = Object.assign({}, {
        productId: encodeURIComponent(materialID),
        placementids: cartWarrPlacementId,
        categoryId: '',
        contractId: contractID === '' ? null : contractID,
    })

    return Promise.all([post('compareProducts', body), callRichRelevanceRecommondations(RRRequest)])
        .then(([data, placements])=>{
            const warrantyPlacementResponse = placements.find(placement => placement.placementId === cartWarrPlacementId);
            return {
                parentProduct: find(data.products, { materialId: materialID }),
                warranties: warrantyPlacementResponse ? warrantyPlacementResponse.prodList : [],
            }
        })
        .catch((error) => {
            throw error // re-throw error for initial testing of functionality
        })
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

// Combine Manufacturer warranties and Third party warranties
export const getWarrantyMaterialIds = (protection, thirdPartyProtection) => {
    const protectionList = protection?.prodList || [];
    const thirdPartyProtectionList = thirdPartyProtection || [];
    const combinedList = [...protectionList, ...thirdPartyProtectionList];
    // Get the list of warranty ids
    return combinedList?.map((plan) => plan.materialId) || [];
}
