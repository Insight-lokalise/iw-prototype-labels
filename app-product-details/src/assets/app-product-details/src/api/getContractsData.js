import {getContracts} from 'app-api-user-service'
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import {IPS_CONTRACT_ID_COOKIE_NAME, IPS_CONTRACT_NAME_COOKIE_NAME} from '../constants'

export const getContractsData = async(isIPSUser, isLoggedIn) => {
    const ipsContractId = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME) ? getCookie(IPS_CONTRACT_ID_COOKIE_NAME): null
    const ipsContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME) ? getCookie(IPS_CONTRACT_NAME_COOKIE_NAME): null
    
    if(isIPSUser) {
        if(isLoggedIn){
            const {data} = await getContracts()
            const {contracts, openMarket} = data
            const headerContract = contracts.map(({abbreviation, contractID, longDescription}) => ({
                abbreviation,
                contractID,
                longDescription
            }))
            return headerContract
        } else {
            return ipsContractId ? {
                contractNumber: ipsContractId,
                contractName: decodeURIComponent(decodeURIComponent(ipsContractName)) || null
            } : null
        }
    } else {
        return null;
    }
}