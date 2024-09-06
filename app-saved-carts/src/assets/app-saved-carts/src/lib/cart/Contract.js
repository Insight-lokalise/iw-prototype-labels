import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import CartItem from './CartItem'

export default function Contract({
  columnCount,
  fixedQuantity,
  lineItems,
  name,
  productDetails,
  showBand,
  unitPrice
}) {

  /**
   * Returns the specified DEP item from the current contract's lineItems.
   * @param  {string} enrollChildId           id of the DEP item to be returned
   * @param  {number} bundleId                id of bundle which the DEP item is part of, 0 means it's not part of a bundle
   * @return {Object}                         DEP item object
   */
  function showDEPInfo(enrollChildId, bundleId){
    if(bundleId > 0) {
      //parent item is inside a bundle, search inside the specified bundle first
      const bundleItem = lineItems.find(item => item.id == bundleId)
      let bundleDEPItem = bundleItem.lineitems.find(item => item.id == enrollChildId)
      
      if(bundleDEPItem)
        return bundleDEPItem
      //if child DEP item is outside of the bundle, continue to lookup at top level
    }
    return lineItems.find(item => item.id == enrollChildId)
  }

  /**
    cart item with an enrollParentId won't be rendered since it will be shown as
    a child view of the parent cart item
  **/
  if (showBand) return (
    <div className="o-grid  o-grid--justify-between  c-cart__contract">
      <div className="o-grid__item  u-1/1  c-cart__cell  c-cart__cell--contract">
        <h3 className="c-cart__contract-header">
          {`${t('Contract')}: `}
          <strong>{name}</strong>
        </h3>
      </div>
      <div className="o-grid__item  u-1/1">
        { lineItems.map((item) => {
          const { enrollParentId } = item
          return !enrollParentId && 
            (<CartItem
              columnCount={columnCount}
              fixedQuantityProps={fixedQuantity}
              item={item}
              key={`${item.name || item.description}${Math.random()}`}
              productDetailsProps={productDetails}
              unitPriceProps={unitPrice}
              showDEPInfo={showDEPInfo}              
            />)
        }) }
      </div>
    </div>
  )
  return lineItems.map((item) => {
    const { enrollParentId } = item    
    return !enrollParentId &&
      (<CartItem    
        columnCount={columnCount}
        fixedQuantityProps={fixedQuantity}
        item={item}
        isSingle={lineItems.length === 1}
        key={`${item.name || item.description}${Math.random()}`}
        productDetailsProps={productDetails}
        unitPriceProps={unitPrice}
        showDEPInfo={showDEPInfo}
      />)
  })
}

Contract.propTypes = {
  columnCount: PropTypes.number.isRequired,
  fixedQuantity: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  lineItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  productDetails: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  showBand: PropTypes.bool.isRequired,
  unitPrice: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
}

Contract.defaultProps = {
  fixedQuantity: undefined,
  productDetails: undefined,
  unitPrice: undefined,  
}
