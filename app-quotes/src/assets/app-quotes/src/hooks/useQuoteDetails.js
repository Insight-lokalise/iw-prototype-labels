import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getQuoteDetails } from '../api'

/** Get Quote Details Hook
 *
 * Get the requested quote details using the current quote id */
export const useQuoteDetails = (deps = []) => {
  const { id } = useParams()
  const [{ quoteDetails, loading, error }, setQuoteDetails] = useState({
    quoteDetails: null,
    loading: true,
    error: null,
  })

  const fetchQuoteDetails = async () => {
    try {
      // Get quote details
      const quoteDetails = await getQuoteDetails({ id })
      if (!quoteDetails) throw new Error('Resource not found')
      setQuoteDetails({ quoteDetails, loading: false, error: null })
    } catch (err) {
      setQuoteDetails({
        quoteDetails: null,
        loading: false,
        error: err.message,
      })
    }
  }
  useEffect(() => {
    fetchQuoteDetails()
  }, deps)
  return [quoteDetails, loading, error]
}

export default useQuoteDetails
