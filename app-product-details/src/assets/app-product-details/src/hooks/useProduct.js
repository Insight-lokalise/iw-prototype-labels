import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { l } from '@insight/toolkit-utils'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { getProductDetails } from '../api/getProductDetails'
import { getSessionUser } from '../api/getSessionUser'
import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import {IPS_CONTRACT_NAME_COOKIE_NAME, IPS_CONTRACT_ID_COOKIE_NAME} from '../constants'

/** Get Product Details Hook
 *
 * Get product details using the current material id
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * @returns {array} an array containing the product details, loading and error value
 * */
export const getProduct = (deps = []) => {
  const [{ data, isLoggedIn, loading, error }, setProduct] = useState({
    isLoggedIn: false,
    data: null,
    loading: true,
    error: null,
  })
  const { materialId, brand, mfrId } = useParams()

  useEffect(() => {
    const fetch = async () => {
      try {
        const { isIpsLogo, userInformation, isLoggedIn } =
          await getSessionUser()
        const salesOrg =
          userInformation?.salesOrg ||
          getDefaultLoggedOutSalesOrg(l(), isIpsLogo)
        const isIPSUser = (isLoggedIn && userInformation?.isIpsUser) || isIpsLogo
        const ipsContractName = hasCookie(IPS_CONTRACT_NAME_COOKIE_NAME) ? decodeURIComponent(decodeURIComponent(getCookie(IPS_CONTRACT_NAME_COOKIE_NAME))): null
        const ipsContractId = hasCookie(IPS_CONTRACT_ID_COOKIE_NAME) ? getCookie(IPS_CONTRACT_ID_COOKIE_NAME): null
        const activeContract = userInformation?.contract?.name || ipsContractName || null
        const activeContractName = activeContract === 'Open market' ? 'openMarket' : activeContract || null
        const activeContractId = userInformation?.contract?.contractId || ipsContractId
        const selectedProduct = await getProductDetails({
          materialId,
          locale: l(),
          salesOrg,
          isIpsLogo, 
          userInformation, 
          isLoggedIn,
          isIPSUser,
          contractName: activeContractName,
          contractId: activeContractId
        })
        setProduct({
          data: selectedProduct,
          isLoggedIn,
          loading: false,
          error: null,
        })
      } catch (err) {
        setProduct({ loading: false, error: err.message })
      }
    }
    fetch()
    return () => null
  }, [...deps, materialId])

  return [data, isLoggedIn, loading, error]
}

export default { getProduct }
