import React, { useContext } from 'react'
import { t } from '@insight/toolkit-utils'
import { PDPContext } from '../../context'

export const SpecificationsWarranty = () => {
  const { product } = useContext(PDPContext)
  // TODO:API waiting on product manufacturer warranty
  if (!product.manufacturer?.warranty) return null
  return (
    <section className="c-product-specifications__warranty">
      {t('Manufacturer Warranty')}: {product.manufacturer.warranty}
    </section>
  )
}

export default SpecificationsWarranty
