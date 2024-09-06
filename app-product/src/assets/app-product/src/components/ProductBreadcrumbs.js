import React from 'react'
import Breadcrumbs from '@insight/toolkit-react-prototype/lib/Breadcrumbs/Breadcrumbs'
import { getHomeURL, getBuyURL, getCategoryURL, getProductURL } from 'api'

/**
 * Display breadcrumbs for the current product, that provide links back to:
 *  - The home page.
 *  - The buy page.
 *  - The category page for this product.
 *  - The product page itself.
 */
export default function ProductBreadcrumbs({ category, product }) {
  const categoryLabel = category ? product.category.label : ''
  const productTitle = product ? product.title : ''

  return (
    <div className="u-margin-bot-small">
      <Breadcrumbs>
        <Breadcrumbs.Item href={getHomeURL()}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href={getBuyURL()}>Buy</Breadcrumbs.Item>

        {/* Only show the category link if there is a category available. */}
        {category && category.url && (
          <Breadcrumbs.Item href={getCategoryURL(category)}>{categoryLabel}</Breadcrumbs.Item>
        )}

        {/* Show both the title and subtitle, with the latter hidden. */}
        <Breadcrumbs.Item href={getProductURL(product)}>
          {product && product.title}
          {product && product.subtitle && (
            <span className="u-hide">{product.subtitle}</span>
          )}

        </Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}
