import React, {useContext} from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import {Button, QuantitySelector, Icon} from '@insight/toolkit-react'
import {t} from '@insight/toolkit-utils'
import {PDPContext, CompareSimilarContext} from '../../context'
import {Image} from '../../shared/Image/Image'
import {UIContext} from '../../shared/UIContext/UIContext'
import InstantRebates from './InstantRebates'

export const SpecificationsCart = ({
  addingToCart,
  enableViewPricing,
  availableQuantity,
  handleAddItemsToCart,
  quantity,
  setQuantity,
  locale,
  disabled
}) => {
  const {product, isLoggedIn} = useContext(PDPContext)
  const {scrollIntoView} = useContext(UIContext)
  const {similarProducts} = useContext(CompareSimilarContext)
  const hasCompareProducts = similarProducts?.products?.length > 1

  const manufacturerImage = product.manufacturer?.images?.length
    ? product.manufacturer?.images[0]
    : false
  const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false
  return (
    <section className="c-product-specifications__cart o-grid">
      {hasCompareProducts && <Button
        className={cn(
          'c-product-specifications__cart__view-similar c-product-specifications__anchor c-block',
          {
            'c-product-specifications__cart__view-similar--show':
            product.price?.callForPrice,
          }
        )}
        color="secondary"
        onClick={() => {
          scrollIntoView('compare-similar')
        }}
      >
        {t('View similar items')}
      </Button>}
      <div
        className={cn('c-product-specifications__cart__actions', {
          'c-product-specifications__cart__actions--hide':
            product.price?.callForPrice || !enableViewPricing,
        })}
      >
        <QuantitySelector
          id={product.materialId}
          value={quantity}
          size="large"
          className={cn(
            'c-product-specifications__cart__actions__quantity-selector'
          )}
          min={1}
          max={9999999999}
          isDisabled={disabled || addingToCart || product.price?.callForPrice}
          onChange={(value) => setQuantity(value)}
        />
        <Button
          className="c-product-specifications__cart__add-to-cart"
          color="primary"
          disabled={disabled || addingToCart || product.price?.callForPrice}
          isLoading={addingToCart}
          onClick={() => handleAddItemsToCart(quantity)}
        >
          {t('Add to cart')}
        </Button>
        {isStockAndPriceDisabled &&
          <div className="o-grid__item u-2/5@tablet">
            {manufacturerImage ? (
              <div className="c-product-specifications__pricing__brand-logo">
                <Button
                  color="none"
                  aria-label={t('Go to brand category page')}
                  href={`/${locale}/search.html?qtype=all&q=${encodeURIComponent(
                    product.manufacturer?.name?.toLowerCase()
                  )}&qsrc=k`}
                >
                  <Image
                    src={manufacturerImage.url}
                    alt={manufacturerImage.description}
                  />
                </Button>
              </div>
            ) : null}
            {/* TODO:Phase 2 - Display promotional content */}

            {!isLoggedIn ? <InstantRebates/> : null}

            {product.promotion ? (
              <div className="c-product-specifications__pricing__promotion">
                <Icon
                  icon="information-circled"
                  className="c-product-specifications__pricing__ribbon"
                  size={28}
                />
                <span>{product.promotion}</span>
              </div>
            ) : null}
          </div>
        }
      </div>
    </section>
  )
}

SpecificationsCart.propTypes = {
  addingToCart: PropTypes.bool.isRequired,
  availableQuantity: PropTypes.number.isRequired,
  handleAddItemsToCart: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
}

export default SpecificationsCart
