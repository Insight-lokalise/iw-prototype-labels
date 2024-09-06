import React, { useState, useEffect } from 'react'
import { JSONPath } from 'jsonpath-plus'
import { DynamicGrid } from '@insight/toolkit-react'
import {
  getProductDetailLink,
  getBestProductImage,
} from '@insight/toolkit-utils'
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import {
  getFeatureFlags,
  getSessionUser,
  fetchProductListConfig,
  fetchProductListData,
  getTranslations,
  getComparedProducts,
} from 'api'
import { isCesExperience } from '../lib/helpers'
import { ProductListItem } from './ProductListItem'
import { productLayouts, ctaLabels } from '../constants'

export function ProductList({ componentPath }) {
  const [products, setProducts] = useState(null)
  const [layoutConfig, setLayoutConfig] = useState({})
  useEffect(() => {
    renderProducts()
  }, [])

  const renderProducts = () => {
    Promise.all([
      getFeatureFlags(),
      getSessionUser(),
      fetchProductListConfig(componentPath),
      getTranslations(),
    ]).then(([featureFlags, sessionUser, config, translations]) => {
      const { userInformation, isLoggedIn, sessionId, locale, isIpsLogo } =
        sessionUser
      const isCES = isCesExperience(isLoggedIn, userInformation?.isCES)
      const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false
      const enableWebPricing = featureFlags['GNA-11926-NEW-WEB-PRICING']

      function getProductLayout(productLayout, designLayout) {
        const productLayoutData = JSON.parse(
          JSON.stringify(
            productLayouts[productLayout] || productLayouts.fiveColumn
          )
        )
        if (
          designLayout == 'minimal' &&
          /^(two|four|six)Column/.test(productLayout)
        ) {
          productLayoutData.columns.mobile = 1
        }
        return productLayoutData || productLayouts.fiveColumn
      }

      const {
        productLayout = 'fiveColumn',
        ctaDesign = 'secondaryButton',
        ctaContent = 'seeDetails',
        showMfrPart = 'false',
        showStock = 'false',
      } = config.data
      const designLayout =
        (productLayout == 'singleColumn' || productLayout == 'singleCarousel'
          ? 'single'
          : config.data.designLayout) || 'basic'
      const materialIds = JSONPath({
        path: 'data.materialIdList[*].materialId',
        json: config,
      })
      const materialIdList = JSONPath({
        path: 'data.materialIdList[*]',
        json: config,
      })
      const {
        layout: plLayout,
        columns: plColumns,
        lineLimit: plLineLimit,
      } = getProductLayout(productLayout, designLayout)

      setLayoutConfig({ plLayout, plColumns, productLayout })

      const lineLimit = plLineLimit[designLayout]
      const ctaText = ctaLabels[ctaContent] || ctaContent
      const isEMEA = getRegion('insight_current_locale') === 'EMEA'

      const buttonType =
        ctaDesign === 'secondaryButton' ? 'secondary' : 'inline-link'
      const ctaClassName = ctaContent == 'addToCart' ? 'js-add-to-cart' : ''
      const productClassName =
        productLayout == 'singleColumn' || productLayout == 'singleCarousel'
          ? 'c-product__design-layout-single'
          : designLayout == 'basic'
          ? 'c-product__design-layout-basic'
          : 'c-product__design-layout-minimal'

      let materialId = ''
      let description = ''
      let productImage = ''
      let detailsLink = ''
      let listPrice = 0
      let price = 0
      let currencyCode = ''
      let isCallForPrice = false
      let vatPrice = 0
      let manufacturerPartNumber = ''
      let ctaLink = '#'

      console.warn('ProductList CES flow', isCES)

      isCES
        ? // CES flow
          getComparedProducts(materialIds.join('|')).then(
            (productsResponse) => {
              // Convert the product data to HTML.
              const products = materialIdList.reduce(
                (productsAcc, materialOverrides) => {
                  materialId = materialOverrides?.materialId
                  const product = productsResponse?.products.find(
                    (element) => element.materialId === materialId
                  )

                  if (product) {
                    description =
                      materialOverrides.description ||
                      product?.description ||
                      product.longDescription
                    manufacturerPartNumber = product?.manufacturerPartNumber
                    productImage = materialOverrides.image || product?.image
                    detailsLink = getProductDetailLink({
                      description: product?.description,
                      locale,
                      manufacturerName: product?.manufacturerName,
                      manufacturerPartNumber,
                      materialId,
                    })
                    listPrice = product?.price?.listPrice
                    const insightPrice = product?.insightPrice
                    const webPrice = product?.price?.webPrice
                    price = enableWebPricing
                      ? webPrice
                      : isLoggedIn
                      ? insightPrice
                      : listPrice
                    currencyCode = productsResponse?.currency
                    isCallForPrice = product?.callForPrice

                    // If add to cart, the ctaClassName of "js-add-to-cart" connects the button to the addToCart dialog box.
                    ctaLink = ctaContent == 'addToCart' ? '#' : detailsLink

                    let approxStockByAvailabilityMessage = 11
                    switch (product?.availability) {
                      case 'UNAVAILABLE':
                        approxStockByAvailabilityMessage = 0
                        break
                      case 'LIMITED':
                        approxStockByAvailabilityMessage = 9
                        break
                      case 'AVAILABLE':
                        approxStockByAvailabilityMessage = 11
                        break
                    }

                    productsAcc.push(
                      <ProductListItem
                        product={{
                          materialId,
                          productClassName,
                          description,
                          productImage,
                          detailsLink,
                          lineLimit,
                          manufacturerPartNumber,
                          isCallForPrice,
                          isEMEA,
                          currencyCode,
                          listPrice,
                          price,
                          vatPrice,
                          showListPrice: enableWebPricing || isLoggedIn,
                          ctaClassName,
                          ctaLink,
                          ctaText,
                          buttonType,
                          showMfrPart,
                          showStock,
                          locale,
                          approxStockByAvailabilityMessage,
                          isCES,
                          isStockAndPriceDisabled
                        }}
                      />
                    )
                  } else {
                    console.warn(
                      'Product not found in micro-service',
                      materialId
                    )
                  }

                  return productsAcc
                },
                []
              )

              setProducts(products)
            }
          )
        : // legacy flow
          fetchProductListData({ materialIds, locale }).then(
            (productsResponse) => {
              const dataProducts = JSONPath({
                path: 'data.products[*]',
                json: productsResponse,
              })
              const productsData = dataProducts.reduce((acc, product) => {
                acc[product.materialId] = product
                return acc
              }, {})

              // Convert the product data to HTML.
              const products = materialIdList.reduce(
                (productsAcc, materialOverrides) => {
                  const { materialId } = materialOverrides
                  const product = productsData[materialId]

                  if (product) {
                    //get stock number and inventory blowout from old api (not supported yet in new api)
                    const { availabilityMessage, inventoryBlowOut } = product
                    const imageBias =
                      productLayout == 'singleColumn' ? 'large' : 'medium'
                    description =
                      materialOverrides.description || product.description
                    manufacturerPartNumber = product?.manufacturerPartNumber
                    productImage =
                      materialOverrides.image ||
                      getBestProductImage(product.image, imageBias)
                    detailsLink = getProductDetailLink({
                      description: product.description,
                      locale,
                      manufacturerName: product?.manufacturerName,
                      manufacturerPartNumber,
                      materialId,
                    })
                    const prices = product.prices.reduce((acc, pricing) => {
                      const priceKey =
                        (pricing.priceLabel || 'nolabel')
                          .replace(/PRICELABEL/, '')
                          .toLowerCase() + 'Price'
                      acc[priceKey] = pricing
                      return acc
                    }, {})
                    const yourPricing =
                      prices.yourPrice ||
                      prices.coiPrice ||
                      prices.csiPrice ||
                      prices.listPrice ||
                      prices.vatPrice ||
                      {}
                    const listPricing = prices.listPrice || {}
                    const vatPricing = prices.vatPrice || {}

                    price = JSONPath({
                      path: '$.price',
                      json: yourPricing,
                    })[0]
                    listPrice = JSONPath({
                      path: '$.price',
                      json: listPricing,
                    })[0]
                    vatPrice = JSONPath({
                      path: '$.price',
                      json: vatPricing,
                    })[0]
                    currencyCode = JSONPath({
                      path: '$.currency',
                      json: yourPricing,
                    })[0]
                    isCallForPrice = !!prices.callforPrice

                    // If add to cart, the ctaClassName of "js-add-to-cart" connects the button to the addToCart dialog box.
                    ctaLink = ctaContent == 'addToCart' ? '#' : detailsLink

                    productsAcc.push(
                      <ProductListItem
                        product={{
                          materialId,
                          productClassName,
                          description,
                          productImage,
                          detailsLink,
                          lineLimit,
                          manufacturerPartNumber,
                          isCallForPrice,
                          isEMEA,
                          currencyCode,
                          listPrice,
                          price,
                          vatPrice,
                          showListPrice: true,
                          inventoryBlowOut,
                          availabilityMessage,
                          ctaClassName,
                          ctaLink,
                          ctaText,
                          buttonType,
                          showMfrPart,
                          showStock,
                          locale,
                          isCES,
                          isStockAndPriceDisabled
                        }}
                      />
                    )
                  } else {
                    console.warn('Could not find product: ', materialId)
                  }

                  return productsAcc
                },
                []
              )
              setProducts(products)
            }
          )
    })
  }

  return (
    products && (
      <DynamicGrid
        className={
          'c-product-list__product-layout-' + layoutConfig.productLayout
        }
        designLayout={layoutConfig.plLayout}
        columns={layoutConfig.plColumns}
      >
        {products}
      </DynamicGrid>
    )
  )
}
