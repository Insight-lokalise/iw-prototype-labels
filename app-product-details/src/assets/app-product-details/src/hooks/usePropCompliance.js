import { useEffect, useState } from 'react'
import { l } from '@insight/toolkit-utils'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'
import { getPropositionCompliance } from '../api/getPropositionCompliance'
import { getSessionUser } from '../api/getSessionUser'

/** Get Prop 65 Compliance Hook
 *
 * Get prop 65 verbaige for the current material id
 * @param {string} categoryId the current product category code
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * @returns {string} compliance message to display
 * */
export const getPropCompliance = (manufacturerId, categoryId, deps = []) => {
  const [{ data, loading, error }, setPropCompliance] = useState({
    data: null,
    loading: true,
    error: null,
  })

  const fetchPropositionCompliance = async () => {
    try {
      const { isIpsLogo, userInformation } = await getSessionUser()
      const salesOrg =
        userInformation?.salesOrg || getDefaultLoggedOutSalesOrg(l(), isIpsLogo)
      const data = await getPropositionCompliance({
        manufacturerId,
        categoryId,
        salesOrg,
      })
      setPropCompliance({
        data,
        loading: false,
        error: null,
      })
    } catch (err) {
      setPropCompliance({ loading: false, error: err.message })
    }
  }
  useEffect(() => {
    fetchPropositionCompliance()
  }, [...deps, manufacturerId])

  return [data, loading, error]
}

export default { getPropCompliance }
