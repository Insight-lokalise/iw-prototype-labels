import { useEffect, useState } from 'react'
import { getPersonalProducts } from '../api/getPersonalProducts'
import { getSessionUser } from '../api/getSessionUser'

/** Get Product Details Hook
 *
 * Get product details using the current material id
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * @returns {array} an array containing the product details, loading and error value
 * */
export const getPersonalProductLists = (deps = []) => {
  const [{ data, pplLoading, pplError }, setPersonalProducts] = useState({
    data: [],
    pplLoading: true,
    pplError: null,
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        const { isLoggedIn } = await getSessionUser()
        const allPersonalProducts = isLoggedIn? await getPersonalProducts(): []
        setPersonalProducts({
          data: allPersonalProducts,
          pplLoading: false,
          pplError: null,
        })
      } catch (err) {
        setPersonalProducts({ pplLoading: false,  pplError: err.message })
      }
    }
    fetch()
    return () => null
  }, [...deps])

  return [data, pplLoading, pplError]
}

export default { getPersonalProductLists }
