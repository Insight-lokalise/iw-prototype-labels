import React, { useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash-es/get'
import cn from 'classnames'
import { connect } from 'react-redux'

import { Button, connectToLocale, PDPModal } from '@insight/toolkit-react'
import { l, t } from '@insight/toolkit-utils/lib/labels'
import { ApprovedItem, StandardsProduct } from './cartSFCs'
import { IWAnchor } from '../../../iw-components'
import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import { makeProductDetailURL } from '../../../models/Products/productDetails'

import { CartItemQuantityContainer } from './quantity'
import EWR from './ewr'
import { productOnClickGAE } from '@insight/toolkit-utils/lib/analytics'
import DEP from './DEPContainer'
import { fetchProductInformation } from '../../../models/Cart/cart'
import Accessories from './accessories'
import Warranties from './warranties'
import SimpleStockInfo from '@insight/toolkit-react/lib/SimpleStockInfo/SimpleStockInfo'
import StockErrors from './StockErrors'
import { selector_isDefaultLoggedOutUserEnabled } from '../../../../libs/User/selectors/index'

export function CartItemInformation(props) {
  const [miniPDPMaterialId, setMiniPDPMaterialId] = useState(false)

  const readOnly =
    props.bundledItem ||
    props.cartItemDetails.zeroUsage ||
    props.isQuote ||
    props.isCloudCart ||
    props.isReadOnly ||
    props.showLineLevelForm

  const hasCountryOfUsage =
    props.showCountryOfUsageInDescription &&
    props.cartItemDetails.countryOfUsage !== null &&
    props.cartItemDetails.showCountryOfUsage

  const countryOfUsageText = t('Country of usage')
  const insightPartNumberText = props.selectedCartDetails.specialSEWPSession
    ? t('Insight # / CLIN #')
    : t('Insight #')
  const mfgPartNumberText = t('Mfr #')
  const DEPText = t('Organization ID #')
  const TAAText = t('TAA Compliant: Yes')
  const COIText = t('COI')
  const CSIText = t('CSI')
  const reservedText = t('Reserved')
  const UNSPSCText = t('UNSPSC ver')
  const unitPriceText = t('Unit price')
  const quantityText = t('Qty')
  const totalText = t('Total')
  const subTotalText = t('Subtotal')
  const description = props.cartItemDetails.customDescription
    ? props.cartItemDetails.customDescription
    : props.cartItemDetails.description
  const productUrl = makeProductDetailURL({
    description: props.cartItemDetails.description,
    materialId: props.cartItemDetails.materialID,
    mfrId: props.cartItemDetails.mfrPartNumber,
    mfrName: props.cartItemDetails.manufacturerName,
  })
  const isDEPEnrolled =
    props.isLoggedIn &&
    (!props.isB2BUser || props.showAppleDEPForB2B) &&
    props.cartItemDetails.enrollable &&
    !props.showLineLevelForm &&
    !props.showReadOnlyDEPSection &&
    !props.isB2BTransfer
  const isDEPDisabled =
    props.enforceEnrollment || props.cartItemDetails.isDEPDisabled
  const DEPCustomerID = props.isCartPage ? props.customerId : ''
  const {
    isLoggedOutDefaultUser,
    context: { isCES },
  } = props

  const openMiniPDP = (materialId) => setMiniPDPMaterialId(materialId)
  const onClose = () => setMiniPDPMaterialId(false)

  const renderStockInfo = () => {
    if ((!isCES && !isLoggedOutDefaultUser) || readOnly) return null
    if (!props.cartItemDetails.unlimited && props.cartItemDetails.stock <= 10) {
      return (
        <div className="cart-item__stock">
          <div className="o-grid o-grid--justify-right">
            <SimpleStockInfo
              showLimitedStockQty={props.isCartPage}
              stock={props.cartItemDetails.stock}
              unlimited={props.cartItemDetails.unlimited}
              showBackOrder
            />
          </div>
          {props.cartItemDetails.stock > 0 &&
            (props.tentativeQuantity
              ? props.tentativeQuantity > props.cartItemDetails.stock
              : props.cartItemDetails.quantity >
                props.cartItemDetails.stock) && (
              <div className="cart-item__stock--help-text">
                {t('Additional items may be backordered')}
              </div>
            )}
          {props.cartItemDetails.stock <= 0 ? (
            <div className="cart-item__stock--help-text">
              {t('Item will ship when available')}
            </div>
          ) : null}
        </div>
      )
    }
    return (
      <div className="cart-item__stock">
        <StockErrors
          itemDetails={props.cartItemDetails}
          tentativeQuantity={props.tentativeQuantity}
        />
      </div>
    )
  }
  return (
    <div>
      <div className="row expanded">
        <div
          className={`columns flex-child-auto text-left ${cn({
            'cart__table-col--ces-desc': isCES || isLoggedOutDefaultUser,
            'cart__table-col--desc': !isCES && !isLoggedOutDefaultUser,
          })}`}
        >
          {!props.isCloudCart && props.isCartPage ? (
            isCES || isLoggedOutDefaultUser ? (
              <Button
                className="u-text-left"
                onClick={() => openMiniPDP(props.cartItemDetails.materialID)}
                data-gtm-event="cart-item-description-link"
                color="link"
              >
                {props.cartItemDetails.description}
              </Button>
            ) : (
              <IWAnchor
                onClick={(e) => {
                  e.preventDefault()
                  productOnClickGAE(
                    props.cartItemDetails,
                    productUrl,
                    'Cart Items'
                  )
                }}
                data-gtm-event="cart-item-description-link"
                href={productUrl}
              >
                <h4 className="cart__item-heading">
                  {props.cartItemDetails.description}
                </h4>
              </IWAnchor>
            )
          ) : (
            <h4 className="cart__item-heading">
              {props.cartItemDetails.description}
            </h4>
          )}
          <PDPModal
            showPDP={!!miniPDPMaterialId}
            showBackOrder
            fetchProduct={async () => {
              const res = await fetchProductInformation({
                locale: l(),
                materialId: miniPDPMaterialId,
              })
              return { data: res }
            }}
            onClose={onClose}
            isLoggedIn={props.isLoggedIn}
          />
          <div className="cart__table-col--partNumbers">
            <span className="cart__item-part cart__font-size--sm">
              <span className="u-text-bold">{insightPartNumberText}:</span>{' '}
              {props.cartItemDetails.materialID}
            </span>
            <span className="cart__item-part cart__font-size--sm">
              <span className="u-text-bold">{mfgPartNumberText}:</span>{' '}
              {props.cartItemDetails.mfrPartNumber}
            </span>
          </div>
          <div>
            {!props.bundledItem && (
              <div
                className={
                  props.showProductImages
                    ? `row small-negative-left-margin`
                    : 'row hide-images-margin small-negative-left-margin'
                }
              >
                <Accessories
                  contractID={props.contractID}
                  hasAccessories={props.cartItemDetails.hasAccessories}
                  isCartPage={props.isCartPage}
                  isCES={isCES}
                  isLoggedOutDefaultUser={isLoggedOutDefaultUser}
                  isReadOnly={props.isReadOnly}
                  key={`${props.cartItemDetails.materialIDKey}__accessory`}
                  materialID={props.cartItemDetails.materialID}
                  materialIDKey={props.cartItemDetails.materialIDKey}
                  isStockAndPriceDisplayDisabled={props.isStockAndPriceDisplayDisabled}
                />
                <Warranties
                  contractID={props.contractID}
                  isCartPage={props.isCartPage}
                  isCES={isCES}
                  isReadOnly={props.isReadOnly}
                  key={`${props.cartItemDetails.materialIDKey}__warranty`}
                  materialID={props.cartItemDetails.materialID}
                  materialIDKey={props.cartItemDetails.materialIDKey}
                  parentMaterialFromCart={props.cartItemDetails}
                  quantity={props.cartItemDetails.quantity}
                  isStockAndPriceDisplayDisabled={props.isStockAndPriceDisplayDisabled}
                />
              </div>
            )}
          </div>
          <div>
            {props.cartItemDetails.flaggedProduct && (
              <ApprovedItem showProductImages={props.showProductImages} />
            )}
            {props.cartItemDetails.standardsProduct && (
              <StandardsProduct showProductImages={props.showProductImages} />
            )}
          </div>

          {DEPCustomerID && (
            <p className="cart__item-part cart__font-size--sm show-for-print">
              {DEPText}: {props.customerId}
            </p>
          )}
          {DEPCustomerID && (
            <p className="cart__item-part cart__font-size--sm show-for-email">
              {DEPText}: {props.customerId}
            </p>
          )}
          {props.cartItemDetails.productTAACompliant && (
            <p className="cart__item-part cart__font-size--sm">{TAAText}</p>
          )}
          {hasCountryOfUsage && (
            <p className="cart__item-part cart__font-size--sm">
              {countryOfUsageText}: {props.cartItemDetails.countryOfUsage}
            </p>
          )}
        </div>
        {!props.isStockAndPriceDisplayDisabled &&
          props.selectedCartDetails.hasCOI && (
            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--coi">
              <span className="hide-for-medium">{COIText}: </span>
              {props.cartItemDetails.coiQuantity}
            </div>
          )}
        {props.selectedCartDetails.hasCSI && (
          <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--csi">
            <span className="hide-for-medium">{CSIText}: </span>
            {props.cartItemDetails.csiQuantity}
          </div>
        )}
        {props.selectedCartDetails.hasReserved && (
          <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--reserved">
            <span className="hide-for-medium">{reservedText}: </span>
            {props.cartItemDetails.reservedQuantity}
          </div>
        )}
        {Object.keys(props.b2bCartTransferCommoditiesMap).length > 0 && (
          <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--unspsc">
            <span className="cart__table-col--label cart__font-size--sm hide-for-medium">
              {UNSPSCText}:{' '}
            </span>
            {get(
              props.b2bCartTransferCommoditiesMap,
              [props.cartItemDetails.materialID, 'code'],
              ''
            )}
          </div>
        )}
        {!props.isStockAndPriceDisplayDisabled &&
          !isCES &&
          !isLoggedOutDefaultUser && (
            <div
              className={`columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--price medium-text-right ${
                props.showProductImages
                  ? `small-negative-left-margin`
                  : 'small-negative-left-margin hide-images-margin'
              }`}
            >
              <span className="cart__table-col--label cart__font-size--sm hide-for-medium">
                {unitPriceText}{' '}
              </span>
              <Currency
                currencyCode={props.cartItemDetails.currency}
                value={props.cartItemDetails.price}
              />
            </div>
          )}
        <div
          className={cn(
            {
              'cart__table-col--qty-total small-negative-left-margin':
                isCES || isLoggedOutDefaultUser,
            },
            'columns flex-child-auto medium-flex-child-shrink'
          )}
        >
          <div
            className={cn(
              { 'align-justify': isCES || isLoggedOutDefaultUser },
              'row cart__table-col--qty-total__row'
            )}
          >
            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--qty">
              <div>
                <span className="cart__table-col--label cart__font-size--sm hide-for-medium">
                  {quantityText}
                </span>
                <CartItemQuantityContainer
                  cartItemDetails={props.cartItemDetails}
                  contractID={props.contractID}
                  isCartPage={props.isCartPage}
                  readOnly={readOnly}
                  updateItemQuantity={props.updateItemQuantity}
                  context={props.context}
                />
              </div>
            </div>
            {!props.isStockAndPriceDisplayDisabled && (
              <div
                className={`columns flex-child-auto medium-flex-child-shrink cart__table-col ${cn(
                  {
                    'cart__table-col--ces-total':
                      isCES || isLoggedOutDefaultUser,
                    'cart__table-col--total': !isCES && !isLoggedOutDefaultUser,
                  }
                )} medium-text-right u-text-right`}
              >
                <span className="cart__table-col--label cart__font-size--sm hide-for-medium">
                  {isCES || isLoggedOutDefaultUser ? subTotalText : totalText}{' '}
                </span>
                <Currency
                  currencyCode={props.cartItemDetails.currency}
                  value={props.cartItemDetails.totalPrice}
                />
                {(isCES || isLoggedOutDefaultUser) && (
                  <div>
                    (
                    <Currency
                      currencyCode={props.cartItemDetails.currency}
                      value={props.cartItemDetails.price}
                    />
                    {` ${t('each')}`})
                  </div>
                )}
              </div>
            )}
          </div>
          {renderStockInfo()}
        </div>
      </div>
      {props.cartItemDetails.ewrFee !== null &&
        props.cartItemDetails.ewrFee > 0 && (
          <EWR
            ewrFee={props.cartItemDetails.ewrFee}
            currencyCode={props.cartItemDetails.currency}
            isStockAndPriceDisplayDisabled={
              props.isStockAndPriceDisplayDisabled
            }
            quantity={props.cartItemDetails.quantity}
            showProductImages={props.showProductImages}
            isCES={isCES}
          />
        )}
      {isDEPEnrolled && !isLoggedOutDefaultUser && (
        <DEP
          bundleParentMaterialIDKey={props.bundleParentMaterialIDKey}
          childEnrollmentId={props.childEnrollmentId}
          contractID={props.contractID}
          customerId={props.customerId}
          erpManufaturerId={props.cartItemDetails.erpManufaturerId}
          isEnrolled={props.cartItemDetails.enrollable}
          materialIDKey={props.cartItemDetails.materialIDKeyAsInt}
          numberOfItemsInCart={props.cartItemDetails.quantity}
          showCopyToAllLink={props.showCopyToAllLink}
          showProductImages={props.showProductImages}
          isReadOnly={isDEPDisabled}
          enforceEnrollment={props.enforceEnrollment}
        />
      )}
    </div>
  )
}

CartItemInformation.propTypes = {
  bundledItem: PropTypes.bool.isRequired,
  bundleParentMaterialIDKey: PropTypes.string.isRequired,
  b2bCartTransferCommoditiesMap: PropTypes.object,
  cartItemDetails: PropTypes.object.isRequired,
  childEnrollmentId: PropTypes.number.isRequired,
  contractID: PropTypes.string.isRequired,
  enforceEnrollment: PropTypes.bool.isRequired,
  isCartPage: PropTypes.bool,
  isCloudCart: PropTypes.bool.isRequired,
  isB2BTransfer: PropTypes.bool,
  isQuote: PropTypes.bool.isRequired,
  isStockAndPriceDisplayDisabled: PropTypes.bool,
  selectedCartDetails: PropTypes.object.isRequired,
  showCopyToAllLink: PropTypes.bool.isRequired,
  showLineLevelForm: PropTypes.bool,
  showCountryOfUsageInDescription: PropTypes.bool,
  showProductImages: PropTypes.bool.isRequired,
  showAppleDEPForB2B: PropTypes.bool.isRequired,
  // actions
  updateItemQuantity: PropTypes.func.isRequired,
}

CartItemInformation.defaultProps = {
  isCartPage: false,
  isB2BTransfer: false
}

function mapStateToProps(state) {
  return {
    isLoggedOutDefaultUser: selector_isDefaultLoggedOutUserEnabled(state),
  }
}

export default connect(
  mapStateToProps,
  null
)(connectToLocale(CartItemInformation))
