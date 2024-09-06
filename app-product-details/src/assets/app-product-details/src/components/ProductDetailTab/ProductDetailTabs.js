import React, { useContext } from 'react'
import { t } from '@insight/toolkit-utils'
import { ProductDetailTabOverview } from './ProductDetailTabOverview/ProductDetailTabOverview'
import { ProductDetailTabSpecification } from './ProductDetailTabSpecification'
import { ProductDetailTabAccessories } from './ProductDetailTabAccessories'
import { ProductDetailTabProtection } from './ProductDetailTabProtection'
import { ProductDetailTabReviews } from './ProductDetailTabReviews/ProductDetailTabReviews'
import { PDPContext, PlacementsContext } from '../../context'
import { ReviewsProvider } from '../../context/reviews'
import Tabs, { Tab } from '../../shared/Tabs'
import { connectToLocale } from '@insight/toolkit-react'
import { getReviewsAndRatingsFeatureFlag } from '../../shared'

const ProductDetailTabs = ({ context }) => {
  const { accessories = {}, protection, thirdPartyProtection } = useContext(PlacementsContext);
  const { sendTracking, isLoggedIn } = useContext(PDPContext);
  const { permissions, isIPSUser, contract } = context;
  const displayReviewsAndRatings = getReviewsAndRatingsFeatureFlag();
  const isIPSUserWithContract = isIPSUser && !!contract
  const isMultipleContract = isLoggedIn && contract?.contractName === "All" && isIPSUserWithContract

  const renderAccessoriesTab = () => {
    if (!accessories?.prodList?.length || !permissions.enable_accessory_purchase) return null
    return (
      <Tab
        id="accessories"
        label={t('Accessories')}
        onClick={() => sendTracking({ tab: 'Accessories' })}
      >
        <ProductDetailTabAccessories
          accessories={accessories}
          isIPSUserWithContract={isIPSUserWithContract}
          isMultipleContract={isMultipleContract}
        />
      </Tab>
    )
  }
  const renderProtectionTab = () => {
    if ((!protection?.prodList?.length && !thirdPartyProtection?.length) || !permissions.enable_warranty_purchase) return null;
    return (
      <Tab
        id="protection"
        label={t('Protection plans')}
        onClick={() => sendTracking({ tab: 'Protection plans' })}
      >
        <ProductDetailTabProtection 
          protection={protection}
          thirdPartyProtection={thirdPartyProtection}
          isIPSUserWithContract={isIPSUserWithContract}
          isMultipleContract={isMultipleContract}
        />
      </Tab>
    )
  }
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
        {renderAccessoriesTab()}
        {renderProtectionTab()}
        {displayReviewsAndRatings && (
          <Tab
            id="reviews"
            label={t('Reviews')}
            onClick={() => sendTracking({ tab: 'Reviews' })}
          >
            <ReviewsProvider>
              <ProductDetailTabReviews />
            </ReviewsProvider>
          </Tab>
        )}
      </Tabs>
    </section>
  )
}

export default connectToLocale(ProductDetailTabs)
