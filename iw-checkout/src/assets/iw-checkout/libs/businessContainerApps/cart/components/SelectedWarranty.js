import React, { Component, Fragment } from 'react'

import { l, t } from '@insight/toolkit-utils/lib/labels'
import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import { ShowIf } from '../../../higherOrderComponents/showIf'
import { Button, PDPModal } from '@insight/toolkit-react'
import { fetchProductInformation } from '../../../models/Cart'
import cn from 'classnames'

class SelectedWarranty extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  openMiniPDP = (materialId) => {
    this.setState({ miniPDPMaterialId: materialId })
  }

  onClose = () => {
    this.setState({ miniPDPMaterialId: false })
  }

  render() {
    const { miniPDPMaterialId } = this.state
    const {
      selectedProductWarranty,
      selectedProductWarrantyFlag,
      selectedIPPFlag,
      parentMaterialId: materialID,
    } = this.props.parentMaterialFromCart
    const isLoggedIn = this.props.isLoggedIn()
    const isStockAndPriceDisabled = isLoggedIn ? this.props.webGroupPermissions?.includes('disable_stock_and_price_display') : false
    
    const selectedWarrantyView = () => (
      <div className="cart-item__warranty">
        {selectedProductWarrantyFlag ? (
          <div className="row expanded">
            <div className="columns flex-child-auto cart__table-col--desc text-left cart-item__warranty-desc">
              <h5 className="selected-warranty__item-heading">
                {t('Protection')}
              </h5>
              {this.props.isReadOnly ? (
                <h4 className="cart__item-heading">
                  {selectedProductWarranty.description}
                </h4>
              ) : (
                <Button
                  className="u-text-left"
                  onClick={() =>
                    this.openMiniPDP(selectedProductWarranty.warrMaterialId)
                  }
                  data-gtm-event="cart-item-description-link"
                  color="link"
                >
                  {selectedProductWarranty.description}
                </Button>
              )}
              <div className="cart__table-col--partNumbers">
                <span className="cart__item-part cart__font-size--sm">
                  <span className="u-text-bold">{t('Insight #')}:</span>{' '}
                  {selectedProductWarranty.warrMaterialId}
                </span>
                <span className="cart__item-part cart__font-size--sm">
                  <span className="u-text-bold">{t('Mfr #')}:</span>{' '}
                  {selectedProductWarranty.warrMaterialId}
                </span>
              </div>
            </div>
            <PDPModal
              showPDP={!!miniPDPMaterialId}
              fetchProduct={async () => {
                const res = await fetchProductInformation({
                  locale: l(),
                  materialId: miniPDPMaterialId,
                })
                return { data: res }
              }}
              onClose={this.onClose}
              isLoggedIn={this.props.isLoggedIn}
              showPrice={!isStockAndPriceDisabled}
              isIPSUser={this.props.isIPSUser}
            />
            {!this.props.isCES && !this.props.isLoggedOutDefaultUser && !isStockAndPriceDisabled && (
              <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--price medium-text-right">
                <Currency
                  currencyCode={this.props.parentMaterialFromCart.currency}
                  value={selectedProductWarranty.priceValue}
                />
              </div>
            )}
            <div
              className={cn(
                {
                  'cart__table-col--qty-total':
                    this.props.isCES || this.props.isLoggedOutDefaultUser,
                },
                'columns flex-child-auto medium-flex-child-shrink'
              )}
            >
              <div
                className={cn(
                  {
                    'align-justify':
                      this.props.isCES || this.props.isLoggedOutDefaultUser,
                  },
                  'row align-middle'
                )}
              >
                <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col--qty cart-item__qty--readonly text-center">
                  {selectedProductWarranty.quantity}
                </div>
                <div
                  className={cn(
                    'columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--total medium-text-right',
                    {
                      'cart__table-col--total--CES': this.props.isCES,
                    }
                  )}
                >
                  {!isStockAndPriceDisabled &&
                    <Currency
                      currencyCode={this.props.parentMaterialFromCart.currency}
                      value={selectedProductWarranty.totalPrice}
                    />
                  }
                  {this.props.isCES ||
                    (this.props.isLoggedOutDefaultUser && !isStockAndPriceDisabled && (
                      <div>
                        (
                        <Currency
                          currencyCode={
                            this.props.parentMaterialFromCart.currency
                          }
                          value={selectedProductWarranty.priceValue}
                        />
                        {` ${t('each')}`})
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          'Ipp warranty selected'
        )}
      </div>
    )

    return (
      <Fragment>
        <ShowIf test={selectedProductWarrantyFlag || selectedIPPFlag}>
          <div className="cart__table-col">{selectedWarrantyView()}</div>
        </ShowIf>
      </Fragment>
    )
  }
}

export default SelectedWarranty
