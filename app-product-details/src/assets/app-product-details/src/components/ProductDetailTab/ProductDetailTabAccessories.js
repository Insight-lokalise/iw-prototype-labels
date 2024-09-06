import React, {
  Fragment,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import ProductDetailTabResource from './ProductDetailTabResource'
import { PlacementsContext } from '../../context'
import { UIContext } from '../../shared/UIContext/UIContext'
import { ADD_TO_CART_CATEGORY_TYPES } from '../../constants'

export const ProductDetailTabAccessories = ({ disableNavLinks, limit = 5, accessories, isIPSUserWithContract, isMultipleContract }) => {
  const { scrollIntoView } = useContext(UIContext)
  const [showMore, setShowMore] = useState(false)
  const {  recommendationsPrices, recommendationsSSEComplete } = useContext(PlacementsContext);

  // Check if the product list contains items
  if (!accessories?.prodList?.length) {
    return <h5>{t('No Accessories found')}</h5>
  }
  // Set limit to accessories length or limit to 5
  const length = showMore ? accessories.prodList.length : limit
  // Get visible accessories using the set limit
  let visibleAccessories = accessories.prodList.slice(0, length)
  if(recommendationsSSEComplete && recommendationsPrices && Object.keys(recommendationsPrices).length) {
        visibleAccessories = accessories?.prodList.map(product => {
          let priceAndContractObj = recommendationsPrices[product?.materialId] || {};
          if (isMultipleContract) {
            priceAndContractObj = (recommendationsPrices[product?.materialId]?.additionalPrices && recommendationsPrices[product?.materialId]?.additionalPrices?.length > 0) ? recommendationsPrices[product?.materialId]?.additionalPrices[0] : priceAndContractObj;
          }
          if (priceAndContractObj) {
            return {
              ...product,
              price: {price: priceAndContractObj?.webPrice},
              selectedContract: priceAndContractObj
            };
          }
        });
  }

  const initialRender = useRef(true)
  useLayoutEffect(() => {
    // Update ref since component has rendered
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    // Scroll tabs into view when collapsed
    if (!showMore) scrollIntoView('tabs')
  }, [showMore])

  const renderResources = () => {
    if (!visibleAccessories?.length) return <h5>{t('No Accessories found')}</h5>
    return visibleAccessories.map((accessory = {}, index) => (
      <ProductDetailTabResource
        key={index}
        materialId={accessory.materialId}
        partNumber={accessory.manufacturerPartNumber}
        shortDescription={accessory.name}
        longDescription={accessory.description}
        cesSpecs={accessory.cesSpecs}
        price={accessory.price?.price}
        priceInclVat={accessory.price?.priceInclVat}
        currency={accessory.price?.currency}
        disableNavLinks={disableNavLinks}
        image={{ url: accessory.image, description: accessory.name }}
        clickTrackingURL={accessory.clickTrackingURL}
        categoryType={ADD_TO_CART_CATEGORY_TYPES.ACCESSORIES}
        selectedContract={accessory?.selectedContract}
        callForPrice={accessory?.selectedContract?.callForPrice}
        searchSSEComplete={recommendationsSSEComplete}
        isIPSUserWithContract={isIPSUserWithContract}
        isMultipleContract={isMultipleContract}
      />
    ))
  }

  return (
    <Fragment>
      {renderResources()}
      {accessories.prodList.length > limit ? (
        <div className="c-product-tabs__show-more">
          {showMore ? (
            <Button
              color="link"
              icon="remove"
              onClick={() => setShowMore(false)}
            >
              {t('View less accessories')}
            </Button>
          ) : (
            <Button color="link" icon="add" onClick={() => setShowMore(true)}>
              {t('View more accessories')}
            </Button>
          )}
        </div>
      ) : null}
    </Fragment>
  )
}
