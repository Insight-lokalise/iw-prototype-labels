import { getContracts } from 'app-api-user-service'
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'

import { 
  CONTRACT_ALL, 
  CONTRACT_OPEN_MARKET,
  IPS_CONTRACT_NAME_COOKIE_NAME,
  IPS_CONTRACT_ID_COOKIE_NAME,
} from '../constants'

export function getContractDetils(headerInfo) {
  const isLoggedIn = headerInfo.isLoggedIn
  const currentContract = headerInfo.contract
  if(!isLoggedIn){
    const ipsContractId = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME)? getCookie(IPS_CONTRACT_ID_COOKIE_NAME): null
    const ipsContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME)? getCookie(IPS_CONTRACT_NAME_COOKIE_NAME): null

    if(ipsContractId){
      return {
        contractNumber: ipsContractId,
        contractName: decodeURIComponent(decodeURIComponent(ipsContractName)),
        displayName: decodeURIComponent(decodeURIComponent(ipsContractName)),
      }
    }else return null
  }
  else {
    return getContracts().then(({ data }) => {
      const { contracts, openMarket } = data
      let mappedContracts = {};
      contracts.map(({ abbreviation, contractID, longDescription }) => {
        const obj = Object.assign({}, {
          displayName: abbreviation,
          contractNumber: contractID,
          contractName: longDescription,
        })
        mappedContracts[contractID] = obj
      })

      if(currentContract?.name === "All") return CONTRACT_ALL
      else if(currentContract?.name === "Open market") return CONTRACT_OPEN_MARKET
      else {
        const selectedId = currentContract?.contractId
        return mappedContracts[selectedId]
      }
    })
  }
}
