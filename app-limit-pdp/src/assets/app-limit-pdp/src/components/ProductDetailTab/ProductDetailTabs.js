import React, { useContext, useMemo } from 'react'
import { t } from '@insight/toolkit-utils'
import { TabManager } from '@insight/toolkit-react'
import { ProductDetailTabOverview } from './ProductDetailTabOverview/ProductDetailTabOverview'
import { ProductDetailTabSpecification } from './ProductDetailTabSpecification'
import { ProductDetailTabReviews } from './ProductDetailTabReviews/ProductDetailTabReviews'
import { PDPContext } from '../../context'
import { ReviewsProvider } from '../../context/reviews'
import Tabs, { Tab } from '../../shared/Tabs'

export const ProductDetailTabs = () => {
  const { sendTracking } = useContext(PDPContext)

  // Set selected tab to window hash
  const selectedTab =
    window.location.hash && window.location.hash.replace(/#/, '')

  return (
    <section className="c-product-tabs">
      <h5 className="c-product-tabs__title">{t('Product details')}</h5>
      <Tabs selected={selectedTab}>
        <Tab
          id="overview"
          label={t('Overview')}
          onClick={() => sendTracking({ tab: 'Overview' })}
        >
          <ProductDetailTabOverview />
        </Tab>
        <Tab
          id="specifications"
          label={t('Specifications')}
          onClick={() => sendTracking({ tab: 'Specifications' })}
        >
          <ProductDetailTabSpecification />
        </Tab>
        <Tab
          id="reviews"
          label={t('Reviews')}
          onClick={() => sendTracking({ tab: 'Reviews' })}
        >
          <ReviewsProvider>
            <ProductDetailTabReviews />
          </ReviewsProvider>
        </Tab>
      </Tabs>
    </section>
  )
}

export default ProductDetailTabs
