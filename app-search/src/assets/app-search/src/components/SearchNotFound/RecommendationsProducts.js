import React, { useState, Fragment, useEffect } from 'react'
import { isEmeaRegion, t } from '@insight/toolkit-utils'
import cn from 'classnames'
import {
  Button,
  Currency,
  Image,
  TextEllipsis,
  Message,
  Loading
} from '@insight/toolkit-react'
import MultipleContractSelection from './MultipleContractSelection'
import {CALL_FOR_PRICE, CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE} from "../../constants";

const trimmedDescriptions = (text, length) =>
  text && text.length > length ? `${text.substring(0, length)}...` : text ? text : '-'


const RecommendedProducts = ({
                               product,
                               currencyCode,
                               index,
                               currency,
                               addToCartState,
                               addToCartHandler,
                               isLoggedIn,
                               isIPSUser,
                               hasViewPricingDisabled,
                               isStockAndPriceDisabled,
                               selectedProduct,
                               contract,
                               priceInfo,
                               isContractLoading,
                               isContractTimedOut,
                               openMiniPDP,
                               locale
}) => {
  if (!product) return null
  // currencyCode - logged-in user currency
  // currency - logged-out user currency
  const userCurrency = currencyCode || currency;
  const showVAT = isEmeaRegion();
  const isIPSUserWithContract = isIPSUser && !!contract
  const isSingleContract = isIPSUserWithContract && ((isLoggedIn && contract?.contractName !== "All") || !isLoggedIn)
  const isMultipleContract = isLoggedIn && contract?.contractName === "All" && isIPSUserWithContract
  const price = product.price?.price || priceInfo?.webPrice;
  const priceInclVat = product.price?.priceInclVat;
  const displayInclVatPrice = showVAT && priceInclVat;
  const [selectedContract, setSelectedContract] = useState(null)
  const contractId = priceInfo?.callForPrice ? '' : (contract?.contractNumber || contract?.contractId)

  useEffect(() => {
    if (isIPSUserWithContract && priceInfo) {
      setSelectedContract((priceInfo?.additionalPrices && priceInfo.additionalPrices.length > 0) ? priceInfo?.additionalPrices[0] : priceInfo)
    }
  }, [priceInfo])

  const renderAddingToCart = () => {
    if (addToCartState.fulfilled) {
      return (
        <Message
          className="c-search-not-found__confirmation__message"
          type="success"
        >
          {t('Added to cart')}
        </Message>
      )
    }
    return null
  }

  return (
    <div className="c-search-not-found__product">
      <div key={index}>
        <div className="c-search-not-found__image">
          <Button
            color="none"
            onClick={() => openMiniPDP(product.materialId, product.clickTrackingURL, contractId)}
          >
            <Image image={product.image} alt={product.name} />
          </Button>
        </div>
        <Button
          color="inline-link"
          className="c-search-not-found__description"
          onClick={() => openMiniPDP(product.materialId, product.clickTrackingURL, contractId)}
          title={product.description}
        >
          {trimmedDescriptions(product.description, 80)}
        </Button>
        {isIPSUserWithContract && isSingleContract &&
          <div className='c-search-not-found__selected-contract-section'>
            {isContractLoading &&
              <div className='o-grid o-grid--center c-search-not-found__selected-contract-name'>
                {t(CONTRACT_LOADING_MESSAGE)}
                &nbsp;
                <Loading/>
              </div>
            }
            {isContractTimedOut &&
              <span className='c-search-not-found__selected-contract-name'>{t(CONTRACT_TIMED_OUT_MESSAGE)}</span>
            }
            {priceInfo?.callForPrice && isIPSUserWithContract && (
              <span className='c-search-not-found__contactForPrice'>{t(CALL_FOR_PRICE)}</span>
            )}
            <>
              {!isContractTimedOut && !priceInfo?.callForPrice &&
                (!contract?.contractNumber ? <div className='c-search-not-found__selected-contract-name'>{t('Openn market')}</div> :
                <div className='c-search-not-found__selected-contract-name'>{trimmedDescriptions((selectedContract?.abbreviation || selectedContract?.contractName || contract?.contractName), 35)}</div>
              )}
              {!isContractTimedOut && !priceInfo?.callForPrice && isIPSUserWithContract && (
                <Currency
                  value={price}
                  currencyCode={currency}
                  className='c-search-not-found__selected-contract-price'
                />
              )}
            </>

          </div>
        }
        {isIPSUserWithContract && isMultipleContract &&
          <MultipleContractSelection
            selectedContract={selectedContract}
            setSelectedContract={setSelectedContract}
            product={product}
            isContractLoading={isContractLoading}
            isContractTimedOut={isContractTimedOut}
            contract={contract}
            currency={currency}
            trimmedDescriptions={trimmedDescriptions}
            price={price}
            priceInfo={priceInfo}
            locale={locale} />
        }
        {!hasViewPricingDisabled &&
          (
            <Fragment>
              {!isStockAndPriceDisabled && !isIPSUserWithContract &&
                <p className='c-search-not-found__description__prices'>
                  <Currency
                    value={price}
                    currencyCode={userCurrency}
                    className={cn({ 'c-currency__ex-vat': showVAT })}
                    showVAT={showVAT}
                    tax={false}
                  />
                  {displayInclVatPrice &&
                    <Currency
                      value={priceInclVat}
                      currencyCode={userCurrency}
                      showVAT={showVAT}
                      tax
                    />
                  }
                </p>
              }
              {priceInfo?.callForPrice && isIPSUserWithContract ? <div className='c-search-not-found__extra-div' /> :
                <Button
                  color="secondary"
                  className={cn("c-search-not-found__cta", { "showIpsCta": isIPSUserWithContract })}
                  isLoading={selectedProduct && addToCartState.loading}
                  isDisabled={selectedProduct && addToCartState.loading || isContractTimedOut || isContractLoading}
                  onClick={() => addToCartHandler(product, selectedContract)}
                >
                  {t('Add to cart')}
                </Button>
              }
            </Fragment>
          )
        }

      </div>
      <div className="c-search-not-found__confirmation">
        {selectedProduct && renderAddingToCart()}
      </div>
    </div>
  )
}

export default RecommendedProducts
