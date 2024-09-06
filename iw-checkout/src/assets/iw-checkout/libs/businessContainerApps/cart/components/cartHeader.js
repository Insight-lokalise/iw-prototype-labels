import React, { Component } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'

export default function CartHeader(props) {
  const allowUpdate =
    props.cartItemTentativeQuantities &&
    props.cartItemTentativeQuantities.length > 0
  const isCES = props.isCES
  const isLoggedOutDefaultUser = props.isLoggedOutDefaultUser
  return (
    <div className="row expanded section__header align-middle is-collapse-child">
      {((!isCES && !isLoggedOutDefaultUser) || !props.isCartPage) && props.headerText && (
        <h3 className="columns shrink section__header-title">
          {props.headerText}
        </h3>
      )}

      {!props.isReadOnly && !props.showLineLevelForm && (
        <div className="hide-for-print hide-for-email hide-for-small columns align-right text-right hide-images-padding">
          {(props.hasUserPreferences || props.isB2BUser) && (
            <div className="columns hide-images-padding">
              {!isCES && !isLoggedOutDefaultUser && (
                <>
                  {allowUpdate ? (
                    <a
                      onClick={() =>
                        props.updateCartItemQuantities(
                          props.cartItemTentativeQuantities
                        )
                      }
                      id="updateAllQuantities"
                      className="columns section__header-title--cart section__header-action"
                    >
                      {t('Update all quantities')}
                    </a>
                  ) : (
                    <span
                      id="updateAllQuantities"
                      className="columns section__header-title--cart section__header-disabled"
                    >
                      {t('Update all quantities')}
                    </span>
                  )}
                  <a
                    onClick={props.toggleProductImages}
                    id="toggleProductImage"
                    className="columns section__header-title--cart section__header-action"
                    tabIndex="0"
                    role="button"
                  >
                    {props.showProductImages
                      ? t('Hide images')
                      : t('Show images')}
                  </a>
                </>
              )}
            </div>
          )}
          <div className="hide-for-print hide-for-email columns text-right hide-images-padding section__header-empty--cart">
            <a
              onClick={props.emptyCart}
              id="emptyCart"
              className="columns section__header-action"
              tabIndex="0"
              role="button"
            >
              {t('Empty cart')}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

CartHeader.propTypes = {
  cart: PropTypes.object.isRequired,
  cartItemTentativeQuantities: PropTypes.array,
  emptyCart: PropTypes.func.isRequired,
  hasUserPreferences: PropTypes.bool,
  headerText: PropTypes.string,
  isCartPage: PropTypes.bool,
  isB2BUser: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  showLineLevelForm: PropTypes.bool,
  showProductImages: PropTypes.bool,
  toggleProductImages: PropTypes.func,
  updateCartItemQuantities: PropTypes.func,
  context: PropTypes.object.isRequired,
}

CartHeader.defaultProps = {
  cartItemTentativeQuantities: [],
  hasUserPreferences: true,
  headerText: '',
  isCartPage: true,
  isReadOnly: false,
  isB2BUser: false,
  showLineLevelForm: false,
  showProductImages: true,
  toggleProductImages: () => {},
  updateCartItemQuantities: () => {},
}
