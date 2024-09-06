import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getComparedProducts } from '../api/compareProducts'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

/** Get Compare List And Similar Hook
 *
 * Get list of compared products using the seperated list of material ids
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * @returns {array} an array containing the compared products, loading and error value
 * */
export const getCompare = (deps = []) => {
  const [{ data, loading, error }, setCompare] = useState({
    data: null,
    loading: true,
    error: null,
  })

  const query = useQuery()
  const fetchCompareProducts = async () => {
    try {
      const compare = await getComparedProducts(query.get('q'))
      setCompare({
        data: compare,
        loading: false,
        error: null,
      })
    } catch (err) {
      setCompare({ loading: false, error: err.message })
    }
  }
  useEffect(() => {
    fetchCompareProducts()
    return () => null
  }, [...deps])

  return [data, loading, error]
}

export default { getCompare }
