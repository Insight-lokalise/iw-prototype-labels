import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductDetailCompare } from '../api/getProductDetailCompare'
import { getSessionUser } from '../api/getSessionUser';

export const getCompareSimilar = (deps = []) => {
  const [{ data, loading, error }, setSimilarProducts] = useState({
    data: null,
    loading: true,
    error: null,
  })
  const { materialId }= useParams()
  useEffect(() => {
    const fetch = async () => {
      try {
        const {
          userInformation,
          isLoggedIn,
          isIpsLogo,
        } = await getSessionUser();
        const isIPSUser = (isLoggedIn && userInformation.isIpsUser) || isIpsLogo
        let similarProducts = []
        if(!isIPSUser) {
          similarProducts = await getProductDetailCompare({
            materialId,
          })
        }
        setSimilarProducts({
          data: similarProducts,
          loading: false,
          error: null,
        })
      } catch (err) {
        setSimilarProducts({ loading: false, error: err.message })
      }
    }
    fetch()
    return () => null
  }, [...deps, materialId])

  return [data, loading, error]
}

export default { getCompareSimilar }
