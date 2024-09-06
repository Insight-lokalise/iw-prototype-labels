import { useState, useEffect } from 'react'
import { getCart } from '../api/getCart'

/** getQuote
 *
 * Get the session cart data to be used as the quote */
export const getQuote = (deps = []) => {
  const [{ quote, loading, error }, setQuote] = useState({
    quote: null,
    loading: true,
    error: null,
  })
  const fetchCart = async () => {
    try {
      // Get cart and carrier data
      const quote = await getCart()
      setQuote({
        quote,
        loading: false,
        error: null,
      })
    } catch (err) {
      setQuote({
        quote: null,
        loading: false,
        error: err.message,
      })
    }
  }
  useEffect(() => {
    fetchCart()
  }, deps)
  return [quote, loading, error]
}

export default getQuote
