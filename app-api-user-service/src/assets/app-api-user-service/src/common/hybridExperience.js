import {isFeatureEnabled} from "./isFeatureEnabled";
import getContracts from "../api/us/getContracts";
import getSoftwareLicenseAgreements from "../api/us/getSoftwareLicenseAgreements";

const HYBRID_EXPERIENCE_FLAG = 'GNA-12142-HYBRID-EXPERIENCE'

export function isHybridXEnabled(isLoggedIn, isCES) {
  // flag for hybrid legacy user for time being
  // will include in ces once align all payload for E4 user
  if(isFeatureEnabled(HYBRID_EXPERIENCE_FLAG)) {
    return isLoggedIn && !isCES
  }
  return false
}

export async function addFieldsForHybridX({isLoggedIn, isCES}, params ={}, additionalInfo) {
  const isHybridEnabled = isHybridXEnabled(isLoggedIn, isCES)
  if(isHybridEnabled){
    const hardwareContracts = []
    const softwareContracts = []

    const { data: { contracts }}  = await getContracts();
    contracts?.forEach(contract => hardwareContracts.push(contract?.contractID))

    const { data: { manufacturerInfos }} = await getSoftwareLicenseAgreements();
    manufacturerInfos?.forEach(manufacturerInfo => {
      manufacturerInfo?.agreements?.forEach(agreement => {
        softwareContracts.push(agreement?.id)
      })
    })

    delete params.fq
    params['consortiaId'] = params['consortiaId'] || 0
    params['returnPrice'] = "sync"
    params['hardwareContracts'] = hardwareContracts
    params['softwareContracts'] = softwareContracts
    if(additionalInfo) {
      Object.assign(params, additionalInfo)
    }

    return true
  }
  return false
}
