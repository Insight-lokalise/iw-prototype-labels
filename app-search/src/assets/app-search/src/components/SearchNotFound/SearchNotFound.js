import React, { useEffect, useState, useContext, Fragment } from 'react'
import cn from 'classnames'
import {
  Button,
  connectToLocale,
  Currency,
  Carousel,
  Image,
  Message,
  PDPModal,
  TextEllipsis
} from '@insight/toolkit-react'
import { t, getUTCTimeStamp, getCurrentLocale, isEmeaRegion, triggerTrackingUrl } from '@insight/toolkit-utils'
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'
import { addToShoppingRequest } from 'app-api-user-service'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import {
  addToCart,
  prepareAddToCartData,
  fetchProductInformation,
} from '../../api'
import { SearchContext } from '../../context/SearchContext'
import SearchContentTile from '../SearchContentTile'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../../constants'
import { getPlacements } from '../../api/getPlacements'
import RecommendedProducts from './RecommendationsProducts'
function SearchNotFound({ context, query, isProductsTab }) {
  const { currencyCode, domainUrl, isLoggedIn, webGroupId, permissions, webGroupPermissions, contract, isIPSUser } = context
  const { recommendations, recommendationsPrices, recommendationsSSEComplete } = getPlacements(contract, isIPSUser)
  const popularProducts = recommendations?.popular?.prodList
  const recommendedProducts = recommendations?.recommended?.prodList
  const isIPSUserWithContract = isIPSUser && !!contract
  const [miniPDPMaterialId, setMiniPDP] = useState(null)
  const [contractId, setContractId] = useState(null)
  const [addToCartState, setAddToCartState] = useState({
    loading: false,
    fulfilled: false,
    rejected: null,
    selectedMaterialId: null,
  })
  const { enableViewPricing } = permissions
  const hasViewPricingDisabled = isLoggedIn && !enableViewPricing
  const { currency, salesOrg, searchDocs, docs } = useContext(SearchContext)
  const isStockAndPriceDisabled = isLoggedIn ? webGroupPermissions?.includes('disable_stock_and_price_display') : false

  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isSingleContract = !(contract?.contractName == 'All' && isIPSUser);
  const isMultipleContract = isLoggedIn && contract?.contractName === "All" && isIPSUserWithContract
  const newWebPriceFeature = window.flags && window.flags['GNA-11926-NEW-WEB-PRICING']

  const openMiniPDP = (materialId, trackingUrl, contractId) => {
    triggerTrackingUrl(trackingUrl);
    setMiniPDP(materialId)
    setContractId(contractId)
  }
  const onClose = () => setMiniPDP(null)

  const initialLoadData = async () => {
    const queryString = {
      searchText: query,
      salesOrg
    }
    await searchDocs(queryString)
  }

  useEffect(() => {
    initialLoadData()
  }, [])

  useEffect(() => {
    if (!addToCartState.fulfilled) return
    // Set timer to remove added to cart message
    const timer = setTimeout(
      () => setAddToCartState({ loading: false, fulfilled: false }),
      10000
    )
    return () => clearTimeout(timer)
  }, [addToCartState.fulfilled])

  const addToCartHandler = async (product, selectedContract) => {
    try {
      triggerTrackingUrl(product.clickTrackingURL);
      setAddToCartState({
        ...addToCartState,
        loading: true,
        selectedMaterialId: product.materialId,
      })

      const { hasAccessories, warrantyMaterialIds, thirdPartyWarrantyIds } =
        await prepareAddToCartData(
          product.materialId,
          locale,
          salesOrg,
          currency
        )
      const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
      const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
      if (isShoppingCartEnabled && !isIPSUserWithContract) {
        //this is done because in case of ips we need to use the addtocart api rather than shopping request for logged out 
        const payload = [
          {
            hasAccessories,
            locale,
            materialId: product.materialId,
            quantity: 1,
            warrantyMaterialIds: warrantyMaterialIds.concat(
              thirdPartyWarrantyIds
            ), //pass all warranty ids to add to cart so add protection link will show on cart page,
          },
        ]
        await addToCartRequest(payload, addToShoppingRequest)
        setAddToCartState({
          ...addToCartState,
          loading: false,
          fulfilled: true,
          selectedMaterialId: product.materialId,
        })
      } else {
        // Add current product to cart
        await addToCart([
          {
            materialID: product.materialId,
            clientBrowserDate: getUTCTimeStamp(),
            programID: '',
            quantity: 1,
            ...(isIPSUserWithContract && { contractID: selectedContract?.contractNumber ? selectedContract?.contractNumber : contract?.contractNumber, contractName: selectedContract?.contractName ? selectedContract?.contractName : contract?.contractName }),
            hasAccessories,
            warrantyMaterialIds: warrantyMaterialIds.concat(
              thirdPartyWarrantyIds
            ), //pass all warranty ids to add to cart so add protection link will show on cart page,
          },
        ])
        setAddToCartState({
          ...addToCartState,
          loading: false,
          fulfilled: true,
          selectedMaterialId: product.materialId,
        })
      }
    } catch (err) {
      setAddToCartState({
        ...addToCartState,
        loading: false,
        rejected: err.message,
      })
    }
  }

  const renderProducts = (products) => {
    if (!products?.length) return null

    return products.map((product, index) => {
      const selectedProduct =
        addToCartState.selectedMaterialId === product.materialId;
      const productMaterialId = product?.materialId
      const priceInfo = isIPSUser ? recommendationsPrices?.[productMaterialId] : {}
      const isContractLoading = !recommendationsSSEComplete && !priceInfo && isIPSUserWithContract
      const isContractTimedOut = recommendationsSSEComplete && !priceInfo && isIPSUserWithContract
      
      return (
        <RecommendedProducts
          product={product}
          currencyCode={currencyCode}
          currency={currency}
          addToCartState={addToCartState}
          addToCartHandler={addToCartHandler}
          isLoggedIn={isLoggedIn}
          isIPSUser={isIPSUser}
          hasViewPricingDisabled={hasViewPricingDisabled}
          isStockAndPriceDisabled={isStockAndPriceDisabled}
          selectedProduct={selectedProduct}
          index={index}
          contract={contract}
          isContractLoading={isContractLoading}
          isContractTimedOut={isContractTimedOut}
          priceInfo={priceInfo}
          openMiniPDP={openMiniPDP}
          locale={locale}
        />
      )
    })
  }
  const renderPopularProducts = () => {
    if (!popularProducts?.length) return null
    return (
      <section className="u-margin-bot-large">
        <h4 className="u-text-bold u-margin-bot-large">
          {t('Explore popular products')}
        </h4>
        <Carousel
          id="carouselMultiple"
          slides={{
            mobile: 1,
            mobileLandscape: 2,
            tablet: 3,
            tabletLandscape: 4,
            desktop: 5,
          }}
        >
          {renderProducts(popularProducts)}
        </Carousel>
      </section>
    )
  }
  const renderRecommendedProducts = () => {
    if (!recommendedProducts?.length) return null
    return (
      <section className="u-margin-bot-large">
        <h4 className="u-text-bold u-margin-bot-large">
          {t('Recommended based on your previous searches')}
        </h4>
        <Carousel
          id="carouselMultiple"
          slides={{
            mobile: 1,
            mobileLandscape: 2,
            tablet: 3,
            tabletLandscape: 4,
            desktop: 5,
          }}
        >
          {renderProducts(recommendedProducts)}
        </Carousel>
      </section>
    )
  }
  return (
    <div className={cn('o-wrapper', { 'c-search-not-found': !isProductsTab })}>
      {!isProductsTab && docs && (
        <div className="c-horizontal-scroll u-margin-bot">
          {docs.slice(0, 5).map((doc, index) => (
            <SearchContentTile
              doc={doc}
              query={query}
              index={index}
              key={doc?.docId}
            />
          ))}
        </div>
      )}
      <section>
        <h3 className="u-text-bold u-margin-bot-large c-search-not-found__heading ">
          {t('No results found for ')} "{query}"
        </h3>
        <div className="u-margin-bot-large">
          <div className="u-margin-bot u-text-bold">{t('Search tips')}</div>
          <div>
            {!isLoggedIn && (
              <div className="u-margin-bot">
                •{' '}
                <a
                  className="u-text-bold"
                  href={`${domainUrl}/insightweb/login`}
                >
                  {t('Login')}
                </a>
                {t('to your Insight.com account and try again.')}
              </div>
            )}
            <div className="u-margin-bot">
              • {t('Check for typos or misspellings.')}
            </div>
            <div className="u-margin-bot">
              • {t('Try different search words.')}
            </div>
            <div className="u-margin-bot">
              • {t('Use more generic search terms or brand names.')}
            </div>
            <div className="u-margin-bot c-search-not-found__note">
              <span className="u-text-bold">{t('Please note:')}</span>
              {t(
                'If you’re searching for unique items such lab configurations and software agreements, search results may not display. Instead, you can contact your account specialist for support.'
              )}
            </div>
          </div>
        </div>
      </section>
      {renderPopularProducts()}
      {renderRecommendedProducts()}
      <PDPModal
        hasContractSection={isIPSUserWithContract && (isSingleContract || isMultipleContract)}
        showPDP={miniPDPMaterialId ? true : false}
        showPrice={!isStockAndPriceDisabled}
        showSaving={newWebPriceFeature}
        showBackOrder={true}
        fetchProduct={async () => {
          const res = await fetchProductInformation({
            locale,
            materialId: miniPDPMaterialId,
            contractId,
            salesOrg: isIPSUser ? '2500' : salesOrg
          })
          return res
        }}
        onClose={onClose}
        isLoggedIn={isLoggedIn}
        isIPSUser={isIPSUser}
      />
    </div>
  )
}

export default connectToLocale(SearchNotFound)
