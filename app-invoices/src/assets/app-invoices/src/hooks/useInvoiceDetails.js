import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InvoiceDetailsMock } from './mock'

export const getInvoiceDetails = (deps = []) => {
  // Get current invoice id
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [invoice, setInvoiceDetail] = useState({})
  useEffect(() => {
    // Set loading state for request
    setLoading(true)
    try {
      // Get invoice by id - api request for invoices
      const selectedInvoice = InvoiceDetailsMock[id]
      // Throw server response error
      if (!selectedInvoice) {
        throw new Error('Invalid invoice id please try again')
      }
      setInvoiceDetail(selectedInvoice.invoiceDetails)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }, deps)

  return [invoice, loading, error]
}

export default { getInvoiceDetails }
