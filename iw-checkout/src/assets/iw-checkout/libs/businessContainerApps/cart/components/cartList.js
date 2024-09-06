import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cn from 'classnames'

import { connectToLocale } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWShowHide, IWExpandCollapseAll } from '../../../iw-components'
import { prependedSmartTrackersWithString } from '../helpers'
import Contract from './contract'
import { selector_isDefaultLoggedOutUserEnabled } from '../../../../libs/User/selectors'
import { connect } from 'react-redux'

export class CartList extends Component {
  componentDidMount() {
    moment.locale(this.props.locale)
  }

  renderContracts = () => {
    const selectedCartDetails = {
      defaultCountryOfUsage: this.props.cart.defaultCountryOfUsage,
      defaultLineLevels: prependedSmartTrackersWithString(
        this.props.cart.defaultLineLevels
      ),
      hasCOI: this.props.cart.hasCOI,
      hasCSI: this.props.cart.hasCSI,
      hasProratableParts: this.props.cart.hasProratableParts,
      hasReserved: this.props.cart.hasReserved,
      hasUsagePeriodReportableNonReportable:
        this.props.cart.hasUsagePeriodReportableNonReportable,
      hasVSPPAndNonVSPPContracts: this.props.cart.hasVSPPAndNonVSPPContracts,
      locale: this.props.locale,
      quoteOrderRequest: this.props.cart.quoteOrderRequest,
      specialSEWPSession: this.props.cart.specialSEWPSession,
    }

    /**
     * determine whether to show contract names
     * @return {boolean} true if one or more contract(s) isn't open market or empty string
     */
    const showContractNames = () => {
      const emptyString = ''
      const openMarket = 'OPEN MARKET'
      return (
        Object.keys(this.props.cart.contracts).filter((contract) => {
          const contractName = this.props.cart.contracts[contract].abbreviation
          return (
            contractName !== emptyString &&
            contractName.toUpperCase() !== openMarket
          )
        }).length > 0
      )
    }

    return Object.keys(this.props.cart.contracts).map((contractName, i) => {
      const showContract = this.props.showLineLevelForm
        ? this.props.lineLevelFormNames.filter((name) => {
            return name.startsWith(`lineLevelForm__${contractName}__`)
          }).length > 0
        : true
      return (
        <IWShowHide key={i} showIf={showContract}>
          <Contract
            b2bCartTransferCommoditiesMap={
              this.props.b2bCartTransferCommoditiesMap
            }
            isCartPage={this.props.isCartPage}
            contractDetails={this.props.cart.contracts[contractName]}
            defaultContactInformation={this.props.defaultContactInformation}
            defaultCountryOfUsage={this.props.defaultCountryOfUsage}
            disableLineLevelLink={this.props.disableLineLevelLink}
            disableDEPLink={this.props.disableDEPLink}
            enableExpandCollapse={this.props.enableExpandCollapse}
            getCart={this.props.getCart}
            hideLineLevelLink={this.props.hideLineLevelLink}
            hasMultipleLicenseInfoForms={this.props.hasMultipleLicenseInfoForms}
            hasUserPreferences={this.props.hasUserPreferences}
            history={this.props.history}
            isB2BUser={this.props.isB2BUser}
            isB2BTransfer={this.props.isB2BTransfer}
            isCloudCart={this.props.isCloudCart}
            isIPSUser={this.props.ipsUser}
            isLoggedIn={this.props.isLoggedIn}
            isReadOnly={this.props.isReadOnly}
            isStockAndPriceDisplayDisabled={
              this.props.isStockAndPriceDisplayDisabled
            }
            lineLevelFormNames={this.props.lineLevelFormNames}
            selectedCartDetails={selectedCartDetails}
            setActiveIndex={this.props.setActiveIndex}
            showContractNames={this.props.ipsUser || showContractNames()}
            showLineLevelForm={this.props.showLineLevelForm}
            showReadOnlyLineLevels={this.props.showReadOnlyLineLevels}
            showReadOnlyDEPSection={this.props.showReadOnlyDEPSection}
            showProductImages={this.props.showProductImages}
            splitItems={this.props.splitItems}
            numberOfItemsInCart={this.props.numberOfItemsInCart}
            numberOfItemsInContract={
              Object.keys(this.props.cart.contracts[contractName].cartItems)
                .length
            }
            // actions
            addToReadOnlyFieldsMap={this.props.addToReadOnlyFieldsMap}
            deleteFromCart={this.props.deleteFromCart}
            saveProrationUsageDate={this.props.saveProrationUsageDate}
            updateItemQuantity={this.props.updateItemQuantity}
            updateChildItems={this.props.updateChildItems}
          />
        </IWShowHide>
      )
    })
  }

  render() {
    const {
      isLoggedOutDefaultUser,
      context: { isCES },
    } = this.props
    return (
      <div className="cart__table">
        <div className="print-show hide-for-small">
          <div
            className={
              'row expanded is-collapse-child cart__table-header text-center ' +
              cn({ 'cart__table-header-ces': isCES || isLoggedOutDefaultUser })
            }
          >
            <div
              className={
                'columns flex-child-grow cart__table-col cart__table-col-header cart__table-col--item text-left' +
                cn({
                  ' cart__table-col--item-ces': isCES || isLoggedOutDefaultUser,
                })
              }
            >
              {t('Item')}
              {!isCES &&
                !isLoggedOutDefaultUser &&
                this.props.enableExpandCollapse &&
                this.props.hasLineLevelsInfoPopulated && (
                  <IWExpandCollapseAll
                    className="line-level__expand-collapse-all hide-for-print"
                    messageType={'cart:linelevel:expandAll'}
                  />
                )}
            </div>
            {!this.props.isStockAndPriceDisplayDisabled &&
              this.props.cart.hasCOI && (
                <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--coi">
                  {t('COI')}
                </div>
              )}
            {!this.props.isStockAndPriceDisplayDisabled &&
              this.props.cart.hasCSI && (
                <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--csi">
                  {t('CSI')}
                </div>
              )}
            {this.props.cart.hasReserved && (
              <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--reserved">
                {t('Reserved')}
              </div>
            )}
            {Object.keys(this.props.b2bCartTransferCommoditiesMap).length >
              0 && (
              <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--unspsc">
                {t('UNSPSC ver') + ' ' + this.props.b2bUnspscCode}
              </div>
            )}
            {!this.props.isStockAndPriceDisplayDisabled &&
              !isCES &&
              !isLoggedOutDefaultUser && (
                <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--price medium-text-right">
                  {t('Unit price')}
                </div>
              )}
            {!isCES && !isLoggedOutDefaultUser ? (
              <>
                <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--qty">
                  {t('Qty')}
                </div>
                {!this.props.isStockAndPriceDisplayDisabled && (
                  <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--total medium-text-right">
                    {t('Total')}
                  </div>
                )}
              </>
            ) : (
              <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--qty-total">
                <div className="align-justify row">
                  <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--qty">
                    {t('Qty')}
                  </div>
                  {!this.props.isStockAndPriceDisplayDisabled && (
                    <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--total medium-text-right">
                      {t('Subtotal')}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="columns flex-child-shrink cart__table-col cart__table-col-header cart__table-col--trash hide-for-print"></div>
          </div>
        </div>
        <div>{this.renderContracts()}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedOutDefaultUser: selector_isDefaultLoggedOutUserEnabled(state),
  }
}

export default connect(mapStateToProps, null)(connectToLocale(CartList))

CartList.propTypes = {
  b2bCartTransferCommoditiesMap: PropTypes.object,
  b2bUnspscCode: PropTypes.string,
  cart: PropTypes.object.isRequired,
  defaultContactInformation: PropTypes.object.isRequired,
  defaultCountryOfUsage: PropTypes.string.isRequired,
  disableDEPLink: PropTypes.bool.isRequired,
  disableLineLevelLink: PropTypes.bool.isRequired,
  enableExpandCollapse: PropTypes.bool.isRequired,
  hideLineLevelLink: PropTypes.bool.isRequired,
  hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
  hasLineLevelsInfoPopulated: PropTypes.bool.isRequired,
  hasUserPreferences: PropTypes.bool.isRequired,
  history: PropTypes.object,
  isB2BTransfer: PropTypes.bool,
  isB2BUser: PropTypes.bool,
  isCartPage: PropTypes.bool.isRequired,
  isStockAndPriceDisplayDisabled: PropTypes.bool,
  ipsUser: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isCloudCart: PropTypes.bool,
  lineLevelFormNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  locale: PropTypes.string.isRequired,
  numberOfItemsInCart: PropTypes.number.isRequired,
  showLineLevelForm: PropTypes.bool,
  showProductImages: PropTypes.bool.isRequired,
  showReadOnlyLineLevels: PropTypes.bool,
  showReadOnlyDEPSection: PropTypes.bool,
  // actions
  addToReadOnlyFieldsMap: PropTypes.func.isRequired,
  deleteFromCart: PropTypes.func.isRequired,
  saveProrationUsageDate: PropTypes.func.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  splitItems: PropTypes.func.isRequired,
  updateItemQuantity: PropTypes.func.isRequired,
  updateChildItems: PropTypes.func.isRequired,
}

CartList.defaultProps = {
  isB2BTransfer: false,
  isCartPage: false,
}
