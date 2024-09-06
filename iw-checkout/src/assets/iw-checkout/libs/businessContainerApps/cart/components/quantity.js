import React, { Component, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import { QuantitySelector } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../../../iw-components'
import { StockStatus } from './cartSFCs'
import { updateTentativeQuantity } from '../actions/cartQuantityActions'
import { selectCartItemsViewByContract } from '../../../Cart/selectors'
import {
  selector_hasStockAndPriceDisplayDisabled,
  selector_isDefaultLoggedOutUserEnabled,
} from '../../../User/selectors'
import generateUniqueId from '../../../../app/libs/utils';

export function Quantity(props) {
  const [quantityToDisplay, setQuantityToDisplay] = useState(
    props.tentativeQuantity
      ? props.tentativeQuantity < 0
        ? ''
        : props.tentativeQuantity
      : props.cartItemDetails.quantity
  )
  const prevQuantity = useRef()

  useEffect(() => {
    prevQuantity.current = quantityToDisplay
    if (props.cartItemDetails.quantity !== prevQuantity.current) {
      setQuantityToDisplay(
        props.tentativeQuantity
          ? props.tentativeQuantity < 0
            ? ''
            : props.tentativeQuantity
          : props.cartItemDetails.quantity
      )
    }
  }, [props.tentativeQuantity, props.cartItemDetails])

  const updateCartQuantities = () => {
    props.updateCartItemQuantities()
  }

  const updateQtyOnChange = (value) => {
    setQuantityToDisplay(value)
    props.onChange(value)
  }

  const updateQtyOnBlur = (value) => {
    setQuantityToDisplay(value)
    props.onBlur(value)
  }

  const {
    cartItemDetails,
    tentativeQuantity,
    readOnly,
    context,
    isLoggedOutDefaultUser,
  } = props
  const isCES = context?.isCES
  const shouldDisplayUpdate =
    tentativeQuantity != null &&
    tentativeQuantity > 0 &&
    cartItemDetails.quantity !== tentativeQuantity
  const quantitySelectorId = generateUniqueId('cart-item-quantity')
  
  return (
    <div className="flex-dir-column text-center cart-item-quantity">
      {readOnly ? (
        <div className="u-text-bold cart-item__qty--readonly">
          {cartItemDetails.quantity}
        </div>
      ) : (
        <QuantitySelector
          id={quantitySelectorId}
          name={quantitySelectorId}
          value={
            isCES || isLoggedOutDefaultUser
              ? quantityToDisplay
              : quantityToDisplay || ''
          }
          onChange={(value) => updateQtyOnChange(value)}
          readOnly={readOnly}
          max={9999999999}
          onBlur={(e) => updateQtyOnBlur(e.target.value)}
          onKeyPress={(event) =>
            event.which === 13 ? updateCartQuantities() : true
          }
        />
      )}
      {!readOnly && (
        <IWAnchor
          className={cn({
            'cart-item__qty-update': true,
            hide: !shouldDisplayUpdate,
          })}
          onClick={() => {
            props.updateItemQuantity({
              materialID: props.materialIDKey,
              itemQuantity: quantityToDisplay,
            })
          }}
        >
          {shouldDisplayUpdate ? t('Update') : null}
        </IWAnchor>
      )}
      {!props.isStockDisplayDisabled &&
        props.isCartPage &&
        !isCES &&
        !isLoggedOutDefaultUser && (
          <StockStatus
            nonShippable={cartItemDetails.nonShipabble}
            stock={cartItemDetails.stock}
            quantity={cartItemDetails.quantity}
          />
        )}
    </div>
  )
}

Quantity.propTypes = {
  cartItemDetails: PropTypes.object.isRequired,
  isCartPage: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  isStockDisplayDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  updateItemQuantity: PropTypes.func.isRequired,
}

const CartItemQuantity = (props) => {
  return <Quantity {...props} />
}

const mapStateToProps = (state, ownProps) => {
  return {
    materialIDKey: ownProps.cartItemDetails.materialIDKey,
    isStockDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state),
    tentativeQuantity: selectCartItemsViewByContract(
      state,
      ownProps.cartItemDetails.materialIDKey,
      ownProps.contractID
    ).tentativeQuantity,
    isLoggedOutDefaultUser: selector_isDefaultLoggedOutUserEnabled(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange(quantityToDisplay) {
      dispatch(
        updateTentativeQuantity({
          contractID: ownProps.contractID,
          materialIDKey: ownProps.cartItemDetails.materialIDKey,
          nonShippable: ownProps.cartItemDetails.nonShipabble,
          quantity: Number(quantityToDisplay),
          stock: ownProps.cartItemDetails.stock,
          isCES: ownProps.isCES,
        })
      )
    },
    onBlur(quantityToDisplay) {
      if (quantityToDisplay === '') {
        dispatch(
          updateTentativeQuantity({
            contractID: ownProps.contractID,
            materialIDKey: ownProps.cartItemDetails.materialIDKey,
            nonShippable: ownProps.cartItemDetails.nonShipabble,
            quantity: Number(ownProps.cartItemDetails.quantity),
            stock: ownProps.cartItemDetails.stock,
            isCES: ownProps.isCES,
          })
        )
      }
    },
  }
}

export const CartItemQuantityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CartItemQuantity)
