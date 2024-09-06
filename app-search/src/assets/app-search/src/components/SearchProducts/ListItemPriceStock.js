import React from 'react';
import { t, isEmeaRegion, getPriceSavingsInformation} from '@insight/toolkit-utils';
import {ILISTVIEW, PRICELABELMAP} from '../../constants';
import {CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE} from '../../constants'
import cn from 'classnames';
import {
  Currency,
  ListPrice,
  SimpleStockInfo,
  connectToLocale,
  Loading, Tooltip
} from '@insight/toolkit-react';

const ListItemPriceStock = ({
                                callForPrice,
                                currency,
                                insightPrice,
                                listPrice,
                                webPrice,
                                indexPrice,
                                listPriceInclVat,
                                displayDiscount,
                                priceLabel,
                                selectedContract,
                                priceInfo,
                                stockNumber,
                                showPriceAndStock,
                                unlimited,
                                view,
                                isOnMobile,
                                context,
                                isIPSUserWithContract,
                                isMultipleContract,
                                isSingleContract,
                                isContractLoading,
                                isContractTimedOut,
                                webPriceInclVat
                            }) => {
    const {isLoggedIn, currencyCode, permissions} = context;
    const currentContract = (!!priceInfo?.additionalPrices) ? priceInfo?.additionalPrices[0] : priceInfo
    const enableViewPricing = permissions?.enableViewPricing
    const enableInventorySearch = isLoggedIn && permissions?.enable_inventory_search
    const hasViewPricingDisabled = isLoggedIn && !enableViewPricing
    const nListPrice = indexPrice? Number(indexPrice): listPrice ? Number(listPrice) : 0
    const nInsightPrice = webPrice ? Number(webPrice) : 0
    const { priceSavings } = getPriceSavingsInformation(nListPrice, nInsightPrice);
    const showSavingAndDiscount = isIPSUserWithContract && displayDiscount && priceSavings > 0
    if (hasViewPricingDisabled) {
        return null
    }

    const isListView = view === ILISTVIEW.list;
    const isGridView = view === ILISTVIEW.grid;
    const grid = isGridView || isOnMobile;
    const showVAT = isEmeaRegion()

    const renderPricing = () => {
        if (callForPrice) {
            return (
                <div className="o-grid__item u-1/1">
                    <div
                        className="c-cart-actions__call-for-price o-grid u-margin-bot-tiny u-text-bold o-grid--justify-left">
                        {t('Contact us for availability & pricing')}
                    </div>
                </div>
            )
        }
        // currencyCode - logged-in user currency
        // currency - logged-out user currency
        const userCurrency = currencyCode || currency
        const displayListPrice =
            !isLoggedIn || Insight?.webGroupPermissions?.includes('list_price')

        const renderPricingLabel = () => {
            return (
                <span className="c-cart-actions__label u-text-bold">
                    {enableInventorySearch && !!priceLabel
                        ? `${t(PRICELABELMAP[priceLabel])}:`
                        : `${t('Your price:')}` }
                </span>
            )
        }

        return (
            <div className="o-grid__item u-1/1">
                {showPriceAndStock && (
                    <div className={cn('c-cart-actions__price-container o-grid__item u-1/1 o-grid', {
                        grid: isGridView,
                        list: isListView,
                    })}
                    >
                        {(displayListPrice || showSavingAndDiscount) && (
                            <div
                                className={cn('o-grid__item u-1/1 u-margin-bot-tiny', {
                                    'custom-display-flex': isGridView,
                                })}
                            >
                                <div className={cn("c-cart-actions__list_price_label",{
                                  'c-cart-actions__list_price_label_align-right': !grid,
                                  'c-cart-actions__list_price_label_align-left': grid
                                })}
                                  >
                                    <ListPrice
                                        isLoggedIn={isLoggedIn}
                                        listPrice={listPrice}
                                        insightPrice={webPrice}
                                        indexPrice={indexPrice}
                                        currencyCode={userCurrency}
                                        showListPriceLabel
                                        strike
                                        labelClassName="u-text-bold"
                                        showVAT={showVAT}
                                        tax={false}
                                        showSaving={showSavingAndDiscount}
                                        showDiscount={showSavingAndDiscount}
                                    />
                                </div>
                            </div>
                        )}
                        <div
                            className={cn('o-grid__item o-grid--baseline  o-grid u-1/1', {
                                'o-grid--justify-right': isListView && !isOnMobile,
                                'o-grid--justify-left': isGridView || isOnMobile,
                            })}
                        >
                            {selectedContract && grid && priceInfo && (
                                <div
                                    className='c-cart-actions__contract-name c-cart-actions__contract-listname c-truncate o-grid u-1/1'>
                                    {
                                        (isSingleContract && !selectedContract?.contractNumber) ?
                                            "Open market" :
                                          <Tooltip content={selectedContract?.abbreviation || selectedContract?.contractName}>
                                            <span className='c-text' style={{webkitBoxOrient: 'vertical'}}>{selectedContract?.abbreviation || selectedContract?.contractName}</span>
                                          </Tooltip>

                                    }
                                </div>
                            )}
                            <div>
                              { /* Do not need to render price label for IPS users */ }
                                {!selectedContract && renderPricingLabel()}
                                <span className={cn({'c-cart-actions__highlighted-price': showVAT})}>
                                <Currency
                                    value={webPrice}
                                    currencyCode={userCurrency}
                                    className="c-currency__price-value"
                                    showVAT={showVAT}
                                    tax={false}
                                />
                                    {
                                        grid && isMultipleContract && (selectedContract?.contractNumber === currentContract?.contractNumber) &&
                                        <span className='c-cart-actions__contract-best-price'>{t('Best price')}</span>
                                    }
                            </span>

                                {showVAT && <div className='c-cart-actions__curreny-aligment'>
                                <span className='o-grid o-grid--justify-right'>
                                <Currency
                                    value={webPriceInclVat}
                                    currencyCode={userCurrency}
                                    className="c-currency__price-value"
                                    showVAT={showVAT}
                                    tax
                                />
                                    {
                                        grid && isMultipleContract && (selectedContract?.contractNumber === currentContract?.contractNumber) &&
                                        <span className='c-cart-actions__contract-best-price'>{t('Best price')}</span>
                                    }
                            </span></div>}

                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
    return (
      <>
        {   // list view price section
            // grid view contract name and price section
          renderPricing()
        }
        { // error handeling for grid view (single contract)
        grid && !showPriceAndStock && (
          <div>
            {isContractLoading && (
              <div className='o-grid c-list-item__contract'>
                <div className='u-text-bold c-cart-actions__contract-name u-margin-bot-tiny'>
                  {t(CONTRACT_LOADING_MESSAGE)}
                </div>
                &nbsp;
                <div className='c-list-item__contract-loading-icon'><Loading/></div>
              </div>
            )}
            {
              isContractTimedOut && <div
                className='u-text-bold c-cart-actions__contract-name u-margin-bot-tiny'>{t(CONTRACT_TIMED_OUT_MESSAGE)}</div>
            }
          </div>
        )}
        { // stock info section for grid view
        grid && !callForPrice ? (
          <div className="u-margin-bot-small c-stock">
            <div className="u-margin-bot-tiny">
              <SimpleStockInfo
                className="u-margin-bot-tiny"
                stock={stockNumber}
                showBackOrder
                unlimited={unlimited}
              />
            </div>
            {(!stockNumber && !unlimited) ? (
              <div className="c-list-item__backorder-message">
                {t('Item will ship when available')}
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    )
}

export default connectToLocale(ListItemPriceStock);
