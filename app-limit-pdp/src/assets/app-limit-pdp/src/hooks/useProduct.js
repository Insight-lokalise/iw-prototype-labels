import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductDetails } from '../api/getProductDetails'
import { getDefaultLoggedOutSalesOrg } from '@insight/toolkit-utils'

/** Get Product Details Hook
 *
 * Get product details using the current material id
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * @returns {array} an array containing the product details, loading and error value
 * */
export const getProduct = (deps = []) => {
  const [{ data, loading, error }, setProduct] = useState({
    data: null,
    loading: true,
    error: null,
  })

  const { locale } = useParams()
  const materialId = window.location.href.split('/products/')[1]
  const salesOrg = getDefaultLoggedOutSalesOrg(locale)

  useEffect(() => {
    const fetch = async () => {
      try {
        const selectedProduct = await getProductDetails({
          materialId,
          locale,
          salesOrg,
        })
        setProduct({
          data: selectedProduct,
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

  return [data, loading, error]
}

export default { getProduct }
