import React, { useState, Fragment, useEffect } from 'react'
import { isEmeaRegion, t } from '@insight/toolkit-utils'
import cn from 'classnames'
import {
  Button,
  Currency,
  Image,
  Message,
  Loading
} from '@insight/toolkit-react'
import MultipleContractSelection from '../MultipleContractSelection'
import {CALL_FOR_PRICE, CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE} from '../../constants'

const trimDescriptions = (text, length) => {
  const data = text && text.length > length ? `${text.substring(0, length)}...` : text ? text : '-'
  return data
}



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
                               isContractTimeOut,
                               locale,
                               openMiniPDP
}) => {
  if (!product) return null
  // currencyCode - logged-in user currency
  // currency - logged-out user currency
  const userCurrency = currencyCode || currency;
  const showVAT = isEmeaRegion();
  const isSingleContract = !(contract?.contractName == 'All' && isIPSUser);
  const price = product.price?.price || priceInfo?.webPrice;
  const priceInclVat = product.price?.priceInclVat;
  const isIPSUserWithContract = isIPSUser && !!contract
  const displayVatPrice = showVAT && priceInclVat;
  const [selectedContract, setSelectedContract] = useState(null)
  const isMultipleContract = isLoggedIn && contract?.contractName === "All" && isIPSUserWithContract
  const contractId = priceInfo?.callForPrice ? '': contract?.contractNumber || contract?.contractId

  useEffect(() => {
    if (isIPSUserWithContract) {
      setSelectedContract((priceInfo?.additionalPrices && priceInfo.additionalPrices.length > 0) ? priceInfo?.additionalPrices[0] : priceInfo)
    }
  }, [priceInfo])

  const renderAddingToCart = () => {
    if (addToCartState?.fulfilled) {
      return (
        <Message
          className="c-product-people-bought-together__confirmation__message"
          type="success"
        >
          {t('Added to cart')}
        </Message>
      )
    }
    return null
  }

  return (
    <div className="c-product-people-bought-together__product">
      <div key={index}>
        <div className="c-product-people-bought-together__image">
          <Button
            color="none"
            onClick={() => openMiniPDP(product.materialId, product.clickTrackingURL, contractId)}
          >
            <Image image={product.image} alt={product.name} />
          </Button>
        </div>
        <Button
          color="link"
          className="c-product-people-bought-together__description"
          onClick={() => openMiniPDP(product.materialId, product.clickTrackingURL, contractId)}
          title={product.description}
        >
          {trimDescriptions(product.description, 80)}
        </Button>
        {isIPSUserWithContract && isSingleContract &&
          <div className='c-product-people-bought-together__selected-contract-section'>
            {isContractLoading &&
              <div className='o-grid o-grid--center c-product-people-bought-together__selected-contract-name'>
                {t(CONTRACT_LOADING_MESSAGE)}
                &nbsp;
                <Loading/>
              </div>
            }
            {isContractTimeOut &&
              <span className='c-product-people-bought-together__selected-contract-name'>{t(CONTRACT_TIMED_OUT_MESSAGE)}</span>
            }
            {price && priceInfo?.callForPrice && isIPSUserWithContract && (
              <span className='c-product-people-bought-together__contactForPrice'>{t(CALL_FOR_PRICE)}</span>
            )}
            <>
              {price && !priceInfo?.callForPrice &&
                (!contract?.contractId ? <div className='c-product-people-bought-together__selected-contract-name'>{t('Open Market')} </div> :
                <div className='c-product-people-bought-together__selected-contract-name'>{trimDescriptions((selectedContract?.abbreviation || contract?.contractName), 30)}</div>
              )}
              {price && !priceInfo?.callForPrice && isIPSUserWithContract &&
                <Currency
                  value={price}
                  currencyCode={currency || priceInfo?.currency}
                  className='c-product-people-bought-together__selected-contract-price'
                />
              }
            </>
          </div>
        }
        {isIPSUserWithContract && isMultipleContract &&
          <MultipleContractSelection
            selectedContract={selectedContract}
            setSelectedContract={setSelectedContract}
            product={product}
            isContractLoading={isContractLoading}
            isContractTimeOut={isContractTimeOut}
            contract={contract}
            currency={currency}
            trimDescriptions={trimDescriptions}
            price={price}
            priceInfo={priceInfo}
            locale={locale}
          />
        }
        {!hasViewPricingDisabled &&
          (
            <Fragment>
              {!isStockAndPriceDisabled && !isIPSUserWithContract &&
                <p className='c-product-people-bought-together__prices'>
                  <Currency
                    value={price}
                    currencyCode={userCurrency}
                    className={cn({ 'c-currency__ex-vat': showVAT })}
                    showVAT={showVAT}
                    tax={false}
                  />
                  {displayVatPrice &&
                    <Currency
                      value={priceInclVat}
                      currencyCode={userCurrency}
                      showVAT={showVAT}
                      tax
                    />
                  }
                </p>
              }
              {priceInfo?.callForPrice && isIPSUserWithContract ? <div className='c-product-people-bought-together__extra-div' /> :
                <Button
                  color="secondary"
                  className={cn("c-product-people-bought-together__cta", { "showIpsCta": isIPSUserWithContract })}
                  isLoading={selectedProduct && addToCartState?.loading}
                  isDisabled={selectedProduct && addToCartState?.loading || isContractTimeOut || isContractLoading}
                  onClick={() => addToCartHandler(product, selectedContract)}
                >
                  {t('Add to cart')}
                </Button>
              }
            </Fragment>
          )
        }

      </div>
      <div className="c-product-people-bought-together__confirmation">
        {selectedProduct && renderAddingToCart()}
      </div>
    </div>
  )
}

export default RecommendedProducts
