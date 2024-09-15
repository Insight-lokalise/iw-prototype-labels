import React from 'react'

import { useCallbackRef } from '../../hooks/useCallbackRef'
import { useProductDetailsRowSizeContext } from '../ProductDetailsRowSizeContext'

export const ProductDetailCompareItemRow = ({ children, rowId }) => {
  const watcher = useProductDetailsRowSizeContext()

  const [_, setRef] = useCallbackRef(
    (node) => watcher.register(rowId, node),
    (node) => watcher.unregister(rowId, node)
  )

  return (
    <div ref={setRef} className="c-product-compare__item__row o-grid__item">
      {children}
    </div>
  )
}

export default ProductDetailCompareItemRow