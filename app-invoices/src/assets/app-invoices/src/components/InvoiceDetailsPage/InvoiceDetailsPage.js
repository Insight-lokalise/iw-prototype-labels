import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Loading } from '@insight/toolkit-react'
import { 
  getInvoiceDetails,
  getAccountInformation,
 } from '../../api'
import { InvoiceDetails } from './InvoiceDetails'

export const InvoiceDetailsPage = () => {
  const { id } = useParams()
  const [error, setError] = useState(null)
  const [invoiceDetail, setInvoiceDetail] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isCanada, setIsCanada ] = useState(false)

  useEffect(() => {
    getInvoiceDetails({ id })
      .then((data) => {
        setInvoiceDetail(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
    getAccountInformation()
    .then((userRes) => {
      const isCanadaUser = userRes?.salesOrg === '4100'
      setIsCanada(isCanadaUser)
    })
  }, [])

  document.title = t('Invoice details')

  return (
    <section className="c-app-invoice-details">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <h1 className="u-h3">{t(error)}</h1>
      ) : (
        <InvoiceDetails
          isCanada={isCanada}
          header={invoiceDetail.header}
          shoppingRequest={invoiceDetail.shoppingRequest}
        />
      )}
    </section>
  )
}

export default InvoiceDetailsPage
