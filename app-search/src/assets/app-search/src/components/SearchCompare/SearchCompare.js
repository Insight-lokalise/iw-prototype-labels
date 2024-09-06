import React, { useContext } from 'react'
import { Button } from '@insight/toolkit-react'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'
import { productOnClickGAE } from '@insight/toolkit-utils/lib/analytics'
import { makeProductDetailURL } from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'
import { Image } from '../../shared/Image'
import { CompareContext } from '../../context/CompareContext'
export const SearchCompare = ({isLoggedIn, isIPSUser}) => {
  const { products, removeProduct, clearAll } = useContext(CompareContext)
  const isProductComparedEnabled = (isLoggedIn && isIPSUser) ? window?.Insight?.userPermissions?.includes('product_compare') : true
  const totalProducts = products.length
  if (!totalProducts || !isProductComparedEnabled) return null

  const compareProducts = () => {
    // Get material ids for the selected products
    let materialIds = products.map(({ materialId }) => materialId).join('|')
    // Encode material ids
    materialIds = encodeURIComponent(materialIds)
    // Navigate to compare similar page passing materials as query param
    window.location.href = `/insightweb/product-compare?q=${materialIds}`
  }

  const gotoPDP = async (event, product, preparedProductURL) => {
    event.preventDefault()
    const analyticsProduct = {
      description: product.description,
      materialID: product.materialId,
      price: product.price,
      manufacturerName: product.manufacturerName,
      categoryId: '', // to be checked with Product owner as do not have this in new search result
    }
    productOnClickGAE(
      analyticsProduct,
      preparedProductURL,
      'Product Compare',
      0
    )
    window.location = preparedProductURL
  }

  const renderProducts = () => {
    if (!products || !totalProducts) return null
    return products.map((product) => {
      const preparedProductURL = makeProductDetailURL({
        materialId: product.materialId,
        mfrName: product.manufacturerName,
        manufacturerId: product.manufacturerPartNumber,
        description: product.description,
      })
      return (
        <div className="o-grid__item u-1/4">
          <div className="c-search-compare__items__product">
            <Button
              className="c-search-compare__items__product__close"
              icon="close"
              onClick={() => removeProduct(product.materialId)}
            />
            <div className="c-search-compare__items__product__container o-grid">
              <div className="o-grid__item u-1/1 u-1/3@tablet">
                <Image src={product.image} alt={product.description} />
              </div>
              <div className="o-grid__item u-1/1 u-2/3@tablet u-show@tablet">
                <Button
                  className={cn(
                    'c-search-compare__items__product__container__link'
                  )}
                  color="inline-link"
                  href={preparedProductURL}
                  onClick={(event) =>
                    gotoPDP(event, product, preparedProductURL)
                  }
                  title={product.description}
                >
                  <span>{product.description}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }
  const renderPlaceholder = () => {
    const placeholders = 4 - totalProducts
    return Array.from({ length: placeholders }).map(() => (
      <div className="o-grid__item u-1/4">
        <div className=" c-search-compare__items__placeholder" />
      </div>
    ))
  }
  return (
    <section className="c-search-compare">
      <div className="row">
        <div className="o-grid o-grid--gutters">
          <div className="o-grid__item u-1/1 u-5/6@tablet">
            <div className="o-grid o-grid--gutters-small c-search-compare__items">
              {renderProducts()}
              {renderPlaceholder()}
            </div>
          </div>
          <div className="o-grid__item u-1/1 u-1/6@tablet">
            <div className="o-grid o-grid--gutters-small c-search-compare__actions">
              <div className="o-grid__item u-1/1">
                <Button
                  className="c-search-compare__actions__compare c-button--block"
                  color="primary"
                  size="small"
                  isDisabled={totalProducts < 2}
                  onClick={compareProducts}
                >
                  {`${t('Compare')} (${totalProducts} ${t('of')} 4)`}
                </Button>
              </div>
              <div className="o-grid__item u-1/1">
                <Button
                  className="c-button--block"
                  color="secondary"
                  size="small"
                  onClick={clearAll}
                >
                  {t('Clear all')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchCompare
