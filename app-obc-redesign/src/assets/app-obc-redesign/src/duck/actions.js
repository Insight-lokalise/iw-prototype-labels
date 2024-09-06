import {
  SET_OBCINFO,
  SET_TABCHANGE,
  SET_DELIVERYINFO,
  SET_CLIENT_CONFIG,
  SET_CONTRACT_INFO,
  SET_SOLD_TO,
} from './types'
import { PAGES } from '../constants'

export function updateContracts(contracts, consortiaAgreement) {
    return { type: SET_DELIVERYINFO, payload: {
        contractList: contracts,
        consortiaAgreement
      }
    }
  }

export function updateOccurrences(schedule) {
  const {freqSelected, regionSelected, scheduledDate, timeSelected, timeZoneSelected} = schedule

    return { 
      type: SET_DELIVERYINFO, 
      payload: {
        frequency: freqSelected,
        scheduledStartDate: scheduledDate,
        scheduledRunTime: timeSelected,
        timeZoneRegion: regionSelected,
        timeZone: timeZoneSelected,
      }
    }
  }

export function updateDelivery(fields) {
    return { type: SET_DELIVERYINFO, payload: {
        ...fields
      }
    }
  }

export function updateClientConfigs(payload) {
  return { type: SET_CLIENT_CONFIG, payload }
}

export function updateOBCInfo(data) {
    return { type: SET_OBCINFO, payload: data }
}

export function updateContractInfo(data) {
  return {type: SET_CONTRACT_INFO, payload: data}
}

export function updateTabChange(id) {

    const step = (() => {

      switch (id) {
        case PAGES.CONTRACTS:
          return 0
        case PAGES.OCCURRENCES:
          return 1
        case PAGES.DELIVERY:
          return 2
        case PAGES.CATALOG:
          return 3
        default:  
          return 0
      }
    })()

    return { type: SET_TABCHANGE, payload: { step, id }}
}
