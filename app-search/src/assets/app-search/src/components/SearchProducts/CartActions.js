import React, { Fragment, useState } from 'react';
import cn from 'classnames';
import {
  Button,
  QuantitySelector,
  Loading,
  Tooltip
} from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { ILISTVIEW } from '../../constants';
import ListItemPriceStock from './ListItemPriceStock';
import { CONTRACT_LOADING_MESSAGE, CONTRACT_TIMED_OUT_MESSAGE } from '../../constants'

function CartActions({
  index,
  callForPrice,
  currency,
  isOnMobile,
  insightPrice,
  listPrice,
  webPrice,
  indexPrice,
  priceInfo,
  isIPSUserWithContract,
  isMultipleContract,
  isSingleContract,
  inclVatPrice,
  displayDiscount,
  priceLabel,
  view,
  onAddToCart,
  onViewSimilar,
  stockNumber,
  showPriceAndStock,
  unlimited,
  selectedContract,
  isContractLoading,
  isContractTimedOut,
  listPriceInclVat,
  webPriceInclVat
}) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const isListView = view === ILISTVIEW.list && !isOnMobile;
  const isGridView = view === ILISTVIEW.grid || isOnMobile;
  const selectedContractName = selectedContract?.abbreviation || selectedContract?.contractName;
  const isLongContractName = selectedContractName?.length > 64;

  const onAddToCartHandler = async () => {
    setLoading(true)
    try {
      await onAddToCart(quantity)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn('c-cart-actions o-grid', {
        list: isListView,
        grid: isGridView,
        'o-grid--justify-right': isListView,
        'o-grid--justify-left': isGridView,
      })}
    >
      {
        // error handling and contract name for list view
        isListView && (
          <>
            <div className='o-grid c-truncate'>
              <div className='u-text-bold c-cart-actions__contract-name u-margin-bot-tiny o-grid--reverse'>
                {isContractLoading && !isMultipleContract && (  
                  <div className='o-grid o-grid--center'>
                    <div>{t(CONTRACT_LOADING_MESSAGE)}</div> &nbsp;
                    <div className='c-list-item__contract-loading-icon'><Loading /></div>
                  </div>
                )}
                {isContractTimedOut && !isMultipleContract && (
                  <span>{t(CONTRACT_TIMED_OUT_MESSAGE)}</span>
                )}
                {priceInfo && !callForPrice &&  (
                  (isSingleContract && !selectedContract?.contractNumber)? 
                    <span>{t('Open market')}</span>
                    :<Tooltip content={selectedContract?.abbreviation || selectedContract?.contractName}>
                      <span className={isLongContractName ? 'c-text long-text' : 'c-text'} style={{webkitBoxOrient: 'vertical'}}>{selectedContract?.abbreviation || selectedContract?.contractName}</span>
                    </Tooltip>
                )}
              </div>
            </div>
            <ListItemPriceStock 
              callForPrice={callForPrice}
              currency={currency}
              insightPrice={insightPrice}
              listPrice={listPrice}
              webPrice={webPrice}
              indexPrice={indexPrice}
              inclVatPrice={inclVatPrice}
              displayDiscount={displayDiscount}
              priceLabel={priceLabel}
              stockNumber={stockNumber}
              showPriceAndStock={showPriceAndStock}
              unlimited={unlimited}
              view={view}
              isOnMobile={isOnMobile}
              selectedContract={selectedContract}
              priceInfo={priceInfo}
              isIPSUserWithContract={isIPSUserWithContract}
              isMultipleContract={isMultipleContract}
              isSingleContract={isSingleContract}
              isContractLoading={isContractLoading}
              isContractTimedOut={isContractTimedOut}
              listPriceInclVat={listPriceInclVat}
              webPriceInclVat={webPriceInclVat}
            />
          </>
        )
      }
      {
      // add to cart button for list view  and grid view
      }
      <div className="c-cart-actions__action-group o-grid__item u-1/1">
        {!isOnMobile && callForPrice ? (
          <Button
            className="c-button--block"
            color={'secondary'}
            size="small"
            onClick={onViewSimilar}
          >
            {t('View similar items')}
          </Button>
        ) : (
            <Fragment>
            <QuantitySelector
              className="c-cart-actions__action-group__qty-selector"
              aria-label={t('Quantity')}
              id={`quantity${index}`}
              name={`quantity${index}`}
              value={quantity}
              isDisabled={loading || callForPrice || isContractLoading || isContractTimedOut}
              min={1}
              max={9999999999}
              size="small"
              onChange={(value) => setQuantity(parseInt(value))}
            />
            <Button
              className="c-button--block c-cart-actions__button-add"
              color={'primary'}
              size="small"
              isLoading={loading}
              isDisabled={callForPrice || isContractLoading || isContractTimedOut}
              onClick={ onAddToCartHandler }
            >
              {t('Add to cart')}
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default CartActions
