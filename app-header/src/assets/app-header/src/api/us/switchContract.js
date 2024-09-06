import axios from 'axios'

import { CONTRACT_TYPE_ALL, CONTRACT_TYPE_OPEN_MARKET } from './constants'
import { windowRedirect } from '../common/util'

export default function switchContract({ id, longDescription }) {
  const isOpenMarketOrAll = id === CONTRACT_TYPE_ALL || id === CONTRACT_TYPE_OPEN_MARKET

  const contractType = longDescription.replace(' ', '%20')
  const contractIDParam = isOpenMarketOrAll ? '' : `contractId=${id}&`
  const redirectURL = isOpenMarketOrAll ? '/insightweb/welcome' : '/insightweb/contractDetail'

  return axios
    .get(`/insightweb/endUser/getContractByContractId?${contractIDParam}contractType=${contractType}`)
    .then(() => ({ redirectURL }))
    .then(windowRedirect)
    .catch(error => {
      console.warn('Failed to switch contract', error)
      throw error
    })
}
