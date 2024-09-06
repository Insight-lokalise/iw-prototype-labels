import addToShoppingRequest from 'api/addToShoppingRequest'
import getUserInformation from 'api/getUserInformation'
import getFeatureFlagByName from "./api/us/getFeatureFlagByName";
import getAllFeatureFlags from "./api/us/getAllFeatureFlags";
import sendSignal from 'api/sendSignal'
import getSoftwareLicenseAgreements from './api/us/getSoftwareLicenseAgreements';
import getContracts from './api/us/getContracts';
import { isHybridXEnabled, addFieldsForHybridX } from "./common/hybridExperience";
import axios, { DELETE, GET, PUT, POST } from "./common/axios";
import {usePlacements} from "./common/usePlacements";

export default {
    addToShoppingRequest,
    getUserInformation,
    sendSignal,
    getFeatureFlagByName,
    getAllFeatureFlags,
    getSoftwareLicenseAgreements,
    getContracts,
    addFieldsForHybridX,
    isHybridXEnabled,
    usePlacements,
    axios, DELETE, GET, PUT, POST
}

