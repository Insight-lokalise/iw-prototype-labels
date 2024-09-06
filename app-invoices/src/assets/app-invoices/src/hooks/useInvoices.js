import { useEffect, useState } from 'react'
import { InvoicesMock } from './mock'

export const getInvoices = (deps = []) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [invoices, setInvoices] = useState([])
  useEffect(() => {
    setInvoices(InvoicesMock)
  }, deps)

  return [invoices, loading, error]
}

export default { getInvoices }
