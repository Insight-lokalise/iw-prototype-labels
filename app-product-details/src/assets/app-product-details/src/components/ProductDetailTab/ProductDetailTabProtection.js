import React, { Fragment, useContext, useState, useEffect } from 'react'
import { Button } from '@insight/toolkit-react'
import ProductDetailTabResource from './ProductDetailTabResource'
import { t, isMobile, throttle } from '@insight/toolkit-utils'
import { PlacementsContext } from '../../context'
import {
  ADD_TO_CART_CATEGORY_TYPES,
  DEFAULT_LIMITS,
  PROTECTION_PLANS_HEADING,
  PROTECTION_PLANS_TEXTS,
} from '../../constants'

const { MANUFACTURER_WARRANTIES, OTHER_PROTECTION_PLANS } =
  PROTECTION_PLANS_HEADING
const {
  NO_PROTECTION_PLANS_FOUND,
  VIEW_LESS_PROTECTION_PLANS,
  VIEW_MORE_PROTECTION_PLANS,
} = PROTECTION_PLANS_TEXTS

export const ProductDetailTabProtection = ({
  limit = DEFAULT_LIMITS.WEB,
  disableNavLinks,
  protection,
  thirdPartyProtection,
  isIPSUserWithContract,
  isMultipleContract
}) => {
  const { recommendationsPrices, recommendationsSSEComplete } = useContext(PlacementsContext);
  const [showMore, setShowMore] = useState(false)
  const [showMoreThirdParty, setShowMoreThirdParty] = useState(false)

  // Used to limit results to 3 plans on mobile
  const [isOnMobile, setIsOnMobile] = useState(isMobile())
  useEffect(() => {
    const onResize = throttle(() => {
      setIsOnMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const renderProtections = (plans, heading, isThirdParty = false) => {
    if (!plans?.length) {
      return null
    }

    let showMoreData = showMore,
      setShowMoreData = setShowMore,
      wrapperClass = 'manufacturer-warranties'
    if (isThirdParty) {
      showMoreData = showMoreThirdParty
      setShowMoreData = setShowMoreThirdParty
      wrapperClass = ''
    }

    // Check and update limit based on screen size
    let length = isOnMobile ? DEFAULT_LIMITS.MOBILE : limit
    if (showMoreData) {
      length = plans?.length
    }
    const visiblePlans = plans?.slice(0, length)
    const list = visiblePlans?.map((plan, index) => {
      const selectedContract = isIPSUserWithContract ? !!recommendationsPrices? recommendationsPrices[plan?.materialId]: null : null
      return <ProductDetailTabResource
        key={index}
        materialId={plan.materialId}
        partNumber={plan.manufacturerPartNumber}
        shortDescription={plan.name}
        longDescription={plan.description}
        cesSpecs={plan.cesSpecs}
        price={isIPSUserWithContract? selectedContract?.webPrice: plan.price?.price}
        priceInclVat={isIPSUserWithContract? selectedContract?.priceInclVat : plan.price?.priceInclVat}
        currency={isIPSUserWithContract? selectedContract?.currency : plan.price?.currency}
        disableNavLinks={disableNavLinks}
        image={{ url: plan.image, description: plan.name }}
        clickTrackingURL={plan.clickTrackingURL}
        categoryType={ADD_TO_CART_CATEGORY_TYPES.PROTECTION_PLANS}
        selectedContract={selectedContract}
        callForPrice={isIPSUserWithContract? selectedContract?.callForPrice : false}
        searchSSEComplete={recommendationsSSEComplete}
        isIPSUserWithContract={isIPSUserWithContract}
        isMultipleContract={isMultipleContract}
      />
  })

    const viewLessPlansButton = () => (
      <Button color="link" icon="remove" onClick={() => setShowMoreData(false)}>
        {t(VIEW_LESS_PROTECTION_PLANS)}
      </Button>
    )

    const viewMorePlansButton = () => (
      <Button color="link" icon="add" onClick={() => setShowMoreData(true)}>
        {t(VIEW_MORE_PROTECTION_PLANS)}
      </Button>
    )

    return (
      <div className={`c-product-tabs__section-wrap ${wrapperClass}`}>
        <h5 class="u-text-bold">{heading}</h5>
        {list}
        {plans?.length > limit ? (
          <div className="c-product-tabs__show-more">
            {showMoreData ? viewLessPlansButton() : viewMorePlansButton()}
          </div>
        ) : null}
      </div>
    )
  }

  const renderPlans = () => {
    if (!protection?.prodList?.length && !thirdPartyProtection?.length) {
      return <h5>{t(NO_PROTECTION_PLANS_FOUND)}</h5>
    }
    const protectionList = protection?.prodList
    const thirdPartyPlans = thirdPartyProtection

    return (
      <>
        {renderProtections(protectionList, t(MANUFACTURER_WARRANTIES))}
        {renderProtections(thirdPartyPlans, t(OTHER_PROTECTION_PLANS), true)}
      </>
    )
  }
  return <Fragment>{renderPlans()}</Fragment>
}

export default ProductDetailTabProtection
