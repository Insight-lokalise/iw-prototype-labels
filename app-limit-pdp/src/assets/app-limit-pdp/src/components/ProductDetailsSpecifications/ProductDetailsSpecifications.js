import React from 'react'
import { connectToLocale } from '@insight/toolkit-react'
import { SpecificationsTechOverview } from './SpecificationsTechOverview'

function ProductDetailsSpecifications() {

  return (
    <div className="c-product-specifications">
      <SpecificationsTechOverview />
    </div>
  )
}

export default connectToLocale(ProductDetailsSpecifications)
