import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Loading } from '@insight/toolkit-react'
import cn from 'classnames'

import { Cart } from '../lib'
import { LineItem } from '../lib/lineItems'


export default function DetailsView({ cart, className, hasFailed, isLoading, type }) {
  const {
    additionalInformation,
    contracts,
    shippingAddress,
    shippingOptions,
    billingAddress,
    itemcount,
  } = cart
  if (isLoading) return (
    <div data-testid='details-view-loading' className="u-text-center">
      <Loading size="large" />
    </div>
  )
  // TODO: Implement failure
  if (hasFailed) return <div data-testid='details-view-failed'>Failed</div>
  return (
    <Fragment>
      {
        type === 'orders' &&
        (
          <div data-testid='details-view' className={cn('c-order-template', className)}>
            {additionalInformation && (
              <LineItem
                columns={4}
                list={additionalInformation}
                title={'Additional information'}
              />
            )}
            <div className="o-box  c-order-template__block">
              <div className="o-grid  o-grid--gutters-large">
                {shippingAddress && (
                  <LineItem
                    columns={1}
                    list={shippingAddress}
                    title={'Shipping address'}
                  />
                )}
                {shippingOptions && (
                  <LineItem
                    columns={1}
                    list={shippingOptions}
                    title={'Shipping options'}
                  />
                )}
                {billingAddress && (
                  <LineItem
                    columns={1}
                    list={billingAddress}
                    title={'Billing address'}
                  />
                )}
              </div>
            </div>
          </div>
        )
      }
      <Cart
        contracts={contracts}
        total={itemcount}
        fixedQuantity={{}}
        productDetails={{ displayLineLevel: type === 'orders' }}
        unitPrice={{}}
      />
    </Fragment>
  )
}

DetailsView.propTypes = {
  cart: PropTypes.shape({
    additionalInformation: PropTypes.arrayOf(PropTypes.object),
    billingAddress: PropTypes.objectOf(PropTypes.object),
    shippingOptions: PropTypes.arrayOf,
    contracts: PropTypes.arrayOf(PropTypes.object),
    shippingAddress: PropTypes.objectOf(PropTypes.object),
  }),
  className: PropTypes.string,
  hasFailed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  itemcount: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['carts', 'orders']).isRequired,
}

DetailsView.defaultProps = {
  cart: { contracts: [] },
  className: '',
}
