import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'
import { Button, Icon } from '@insight/toolkit-react'

import FixedQuantity from './FixedQuantity'
import ProductDetails from './ProductDetails'
import { productImageToRender } from '../productImageToRender'
import UnitPrice from './UnitPrice'

export default class CartItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: props.isSingle
    }
    this.toggleBundle = this.toggleBundle.bind(this)
  }

  toggleBundle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  render() {
    const {
      columnCount,
      fixedQuantityProps,
      isInBundle,
      bundleId,
      item: {
        id,
        discontinued,
        approved,
        coi,
        coiStock,
        csi,
        csiStock,
        description,
        imageUrl,
        lineitems,
        lineLevelInfo,
        manufacturerId,
        materialId,
        name,
        proratable,
        productUrl,
        qty,
        regular,
        reserved,
        reservedStock,
        shippable,
        standardsProduct,
        type,
        unitPrice,
        vatInclusivePrice,
        enrollChildId,
      },
      productDetailsProps,
      unitPriceProps,
      showDEPInfo,
    } = this.props
    const { isOpen } = this.state
    const bundleSpan = columnCount - (fixedQuantityProps ? 1 : 0)
    if (type === 'Bundle') return (
      <div className="o-grid  o-grid--justify-between  c-cart__bundle">
        { productDetailsProps && (
          <div className={`o-grid__item  u-${bundleSpan}/${columnCount}@tablet  c-cart__cell  c-cart__cell--bundle-header`}>
            <h3 className="c-cart__bundle-heading">{name}</h3>
          </div>
        )}
        { fixedQuantityProps && (
          <div className={`o-grid__item  o-grid__item--shrink  u-1/${columnCount}@tablet  c-cart__cell  c-cart__cell--qty`}>
            <strong>{qty}</strong>
            <span className="u-hide@tablet">{` ${t('items')}`}</span>
          </div>
        )}
        <div className="o-grid__item  u-1/1  c-cart__cell  c-cart__cell--action">
          <Button color="inline-link" className="c-cart__bundle-btn" onClick={this.toggleBundle}>
            {t(`${isOpen ? 'Close' : 'Open'} items details`)}
            <Icon icon={`arrow-${isOpen ? 'up' : 'down'}`} className="c-cart__bundle-icon" />
          </Button>
        </div>
        { isOpen && (
          <div className="o-grid__item  u-1/1">
            {
               /**
                bundle line level item with an enrollParentId won't be rendered since it will be shown as
                a child view of the parent bundle line level item
              **/
              lineitems.map(bundleItem => {
              const { enrollParentId } = bundleItem
              return !enrollParentId &&
              (<CartItem
                columnCount={columnCount}
                fixedQuantityProps={fixedQuantityProps}
                isInBundle
                bundleId={id}
                item={bundleItem}
                key={bundleItem.materialId}
                productDetailsProps={productDetailsProps}
                unitPriceProps={unitPriceProps}
                showDEPInfo={showDEPInfo}
              />)
            }) }
          </div>
        )}
      </div>
    )

    const itemImage = productImageToRender(imageUrl)
    return (
      <div className={cn("o-grid  c-cart__row", { 'c-cart__row--border  c-cart__row--bundle': isInBundle })}>
        { productDetailsProps && (
          <ProductDetails
            {...productDetailsProps}
            discontinued={discontinued}
            approved={approved}
            description={description}
            imageURL={itemImage}
            insightPart={materialId}
            mfrPart={manufacturerId}
            link={productUrl}
            lineLevelInfo={lineLevelInfo}
            proratable={proratable}
            standardsProduct={standardsProduct}
            enrollChildId={enrollChildId}
            showDEPInfo={showDEPInfo}
            bundleId={bundleId}
          />
        )}
        { unitPriceProps && (
          <UnitPrice
            {...unitPriceProps}
            discontinued={discontinued}
            value={unitPrice}
            vatPrice={vatInclusivePrice}
          />
        )}
        { fixedQuantityProps && (
          <FixedQuantity
            {...fixedQuantityProps}
            discontinued={discontinued}
            coi={coi}
            coiStock={coiStock}
            csi={csi}
            csiStock={csiStock}
            quantity={qty}
            regular={regular}
            reserved={reserved}
            reservedStock={reservedStock}
            shippable={shippable}
          />
        )}
      </div>
    )
  }
}

CartItem.propTypes = {
  columnCount: PropTypes.number.isRequired,
  fixedQuantityProps: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  isInBundle: PropTypes.bool,
  bundleId: PropTypes.number,
  isSingle: PropTypes.bool,
  item: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      discontinued: PropTypes.bool,
      approved: PropTypes.bool,
      coi: PropTypes.bool,
      coiStock: PropTypes.number,
      csi: PropTypes.bool,
      csiStock: PropTypes.number,
      description: PropTypes.string,
      imageUrl: PropTypes.shape({ largeImage: PropTypes.string.isRequired}),
      lineitems: PropTypes.arrayOf(PropTypes.object),
      lineLevelInfo: PropTypes.objectOf(PropTypes.array),
      manufacturerId: PropTypes.string.isRequired,
      materialId: PropTypes.string.isRequired,
      productUrl: PropTypes.string,
      proratable: PropTypes.bool,
      qty: PropTypes.number.isRequired,
      regular: PropTypes.number.isRequired,
      reserved: PropTypes.bool.isRequired,
      reservedStock: PropTypes.number.isRequired,
      shippable: PropTypes.bool,
      type: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      enrollChildId: PropTypes.number,
    }),
    PropTypes.shape({
      lineitems: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ]).isRequired,
  productDetailsProps: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  unitPriceProps: PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ])),
  showDEPInfo: PropTypes.func.isRequired,
}

CartItem.defaultProps = {
  fixedQuantityProps: undefined,
  isInBundle: false,
  bundleId: 0,
  isSingle: false,
  productDetailsProps: undefined,
  unitPriceProps: undefined,
}
