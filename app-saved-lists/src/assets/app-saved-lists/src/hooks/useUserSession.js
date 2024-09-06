import { useEffect, useState } from 'react'
import { getSessionUser } from '../api/getSessionUser'

/** Get User Session Hook
 *
 * Get the current user session
 * @param {array=} deps - Optional dependencies to pass to useEffect
 * @returns {array} an array containing the session, loading and error value
 * */
export const useUserSession = (deps = []) => {
  const [{ session, loading, error }, setProduct] = useState({
    session: null,
    loading: true,
    error: null,
  })
  const fetchUserSession = async () => {
    try {
      // Request session data by calling the session API
      const session = await getSessionUser()
      setProduct({ session, loading: false, error: null })
    } catch (err) {
      setProduct({ loading: false, error: err.message })
    }
  }
  useEffect(() => {
    fetchUserSession()
  }, deps)

  return [session, loading, error]
}

export default { useUserSession }
