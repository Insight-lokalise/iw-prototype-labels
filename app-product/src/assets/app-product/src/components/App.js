import React from 'react'
import ProductSummaryPanel from './ProductSummaryPanel'
import PurchaseSuggestionsPanel from './PurchaseSuggestionsPanel'
import ProductSpecsTabPanel from './ProductSpecsTabPanel'

export default function App() {
  return (
    <div className="o-wrapper">
      <ProductSummaryPanel />
      <PurchaseSuggestionsPanel />
      <ProductSpecsTabPanel />
    </div>
  )
}
