import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import {Button, Currency, Image} from '@insight/toolkit-react'
import {makeProductDetailURL} from '@insight/toolkit-react/lib/PDPModal/PDPHelpers'
import {t, getCurrentLocale, getWebPrice} from '@insight/toolkit-utils'
import FallbackImage from '@insight/toolkit-react/lib/Image/FallbackImage'
import {connectToLocale} from '@insight/toolkit-react/lib/Locale/Locale'
import {sendSignal} from 'app-api-user-service'
import IAHeaderContext from '../../../context/IAHeaderContext'
import {productOnClickGAE} from '@insight/toolkit-utils/lib/analytics'
import {isEmeaRegion} from '../../../libs/helpers'
import {INSIGHT_LOCALE_COOKIE_NAME} from "../../../api/common/locales";

export function SearchProductPreview({
                                       product,
                                       hasSuggestions,
                                       fusionQueryId,
                                       signalMetaData,
                                       salesOrg,
                                       origParams,
                                       query,
                                       context: {currencyCode}, // logged-in user currency
                                       currency, // logged-out user currency
                                       isIPSUserWithContract,
                                       isSingleContract
                                     }) {
  const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const {
    headerInfo: { sessionId, userInformation, isLoggedIn, isIPSUser }
  } = useContext(IAHeaderContext)
  const webGroupPermissions = userInformation?.webGroupPermissions
  const isStockAndPriceDisabled = isLoggedIn ? webGroupPermissions?.includes('disable_stock_and_price_display') : false
  const permissions = userInformation?.permissions;
  const enableViewPricing = permissions?.enableViewPricing;
  const hasViewPricingDisabled = isLoggedIn && !enableViewPricing;
  const showVAT = isEmeaRegion()
  const withIPSPrice = isIPSUser ? !!product?.price : true
  const {
    description,
    image,
    materialId,
    manufacturerName,
    manufacturerPartNumber,
    callForPrice,
    insightPrice,
    price: {listPrice, webPrice, webPriceInclVat, listPriceInclVat} = {}
  } = product

  const productWebPrice = isIPSUserWithContract? product?.price?.webPrice: webPrice
  const contractName = isIPSUserWithContract? (product?.price?.abbreviation || product?.price?.contractName): null

  const trimDescriptions = (text, length) =>
  text && text.length > length ? `${text.substring(0, length)}...` : text ? text : '-'

  const preparedProductURL = makeProductDetailURL({
    materialId,
    mfrName: manufacturerName,
    manufacturerId: manufacturerPartNumber,
    description,
  })

  const clickHandler = async () => {
    const searchType = 'Suggested - Product'
    const queryInfo = {
      queryKeyword: query,
      queryType: searchType,
      queryProductRedirect: 'True',
    }

    /**
     * Set flag 'search-type' to determine how user entered search.
     * Used in Google Analytics in CQ code.
     */
    fireTagEvent('queryInfo', queryInfo)
    const analyticsProduct = {
      description,
      materialID: materialId,
      price: webPrice,
      manufacturerName,
      categoryId: '', // to be checked with Product owner as do not have this in new search result
    }
    localStorage['search-type'] = searchType
    const reqObject = [
      {
        country: locale.split('_')[1],
        ctype: 'typeahead',
        materialId,
        fusionQueryId,
        signalMetaData,
        locale,
        query: origParams.q,
        salesOrg,
        type: 'click',
        sessionId,
        userId: userInformation.cdmUid,
      },
    ]
    await sendSignal(reqObject)
    productOnClickGAE(
      analyticsProduct,
      preparedProductURL,
      'Product Search Bar'
    )
    window._satellite && _satellite.track && _satellite.track('queryInfo')
  }

  const hasPricing = () => !callForPrice && !isStockAndPriceDisabled && !hasViewPricingDisabled && withIPSPrice
  return (
    <div className="c-search-product-preview o-grid">
      <section
        className={cn(
          'o-grid__item',
          {'u-1/6': !hasSuggestions},
          {'u-2/6': hasSuggestions}
        )}
      >
        <div className="c-search-product-preview__product-image o-grid">
          <div className="c-search-product-preview__product-image__container o-grid__item">
            <Button color="inline-link" onClick={clickHandler}>
              {image ? (
                <Image image={image} alt={t(description || 'Product Image')}/>
              ) : (
                <FallbackImage altText={t(description || 'Product Image')}/>
              )}
            </Button>
          </div>
        </div>
      </section>
      <section
        className={cn(
          'c-search-product-preview__product-details o-grid__item',
          {'u-5/6': !hasSuggestions},
          {'u-4/6': hasSuggestions}
        )}
      >
        <div className="c-search-product-preview__product-details__info o-grid">
          <Button
            className="c-search-product-preview__product-details__info__description u-text-bold"
            color="inline-link"
            onClick={clickHandler}
          >
            <span title={description}>{description}</span>
          </Button>
          <div className="c-search-product-preview__part-numbers">
            <div>
              <b>{t('Insight #:')}</b> <span>{materialId}</span>
            </div>
            <div>
              <b>{t('Mfr #:')}</b> <span>{manufacturerPartNumber}</span>
            </div>
          </div>
          <div className="c-search-product-preview__price-container">
            {
              isIPSUserWithContract && (
                <div className='c-search-product-preview__background'>
                  <div className='c-search-product-preview__contract'>
                    <div className='c-search-product-preview__contract-name'>{trimDescriptions(contractName, isSingleContract? 40: 32 )}</div>
                    {!isSingleContract && <div className='c-search-product-preview__best-price'>{t('Best price')}</div>}
                  </div>
                  <div>
                    <Currency
                      value={productWebPrice}
                      currencyCode={currencyCode || currency}
                      showVAT={showVAT}
                      tax={false}
                    />
                  </div>
                </div>
              )
            }
            {(hasPricing()) && !isIPSUserWithContract && (
              <div className={cn({'c-search-product-preview__highlighted-price': showVAT})}>
                <Currency
                  value={webPrice}
                  currencyCode={currencyCode || currency}
                  showVAT={showVAT}
                  tax={false}
                />
              </div>
            )}

            {(showVAT && hasPricing()) && !isIPSUserWithContract && (<>
                <div className="c-search-product-preview__price-container__price">
                  <span className="c-search-product-preview__price-container__price-seperator">|</span>
                </div>
                <div className="c-search-product-preview__price">
                  <Currency
                    value={webPriceInclVat}
                    currencyCode={currencyCode || currency}
                    tax={true}
                    showVAT={showVAT}
                  />
                </div>
              </>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}

export default connectToLocale(SearchProductPreview)

SearchProductPreview.propTypes = {
  product: PropTypes.object.isRequired,
  hasSuggestions: PropTypes.bool.isRequired,
  context: PropTypes.object.isRequired,
  fusionQueryId: PropTypes.string.isRequired,
  signalMetaData: PropTypes.string.isRequired,
  salesOrg: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  origParams: PropTypes.object.isRequired
}
