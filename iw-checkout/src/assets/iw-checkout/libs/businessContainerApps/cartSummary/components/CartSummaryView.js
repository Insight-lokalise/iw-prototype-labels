import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import cn from 'classnames'

import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWHelpIcon } from './../../../../libs/iw-components'

import SummaryRow from './SummaryRow'
import SaveForLater from '../../saveForLater/SaveForLater'
import EWRFee from './EWRFee'

const requestorGroupMessage = 'Please select a Requestor Group'

export class CartSummaryView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            hideMessage: true,
        }
    }

    selectRequestorGroup = event => {
        const [requestorGroupName, requestorGroupId] = event.value.split('::')
        this.props.action_saveRequestorGroupId(requestorGroupId, requestorGroupName)
        this.toggleHideMessage(true)
    };

    showRequiredRequestorGroupMessage = () => {
        this.requestorGroupMessage.classList.remove('hide')
    };

    toggleHideMessage = hide => {
        this.setState({
            ...this.state,
            hideMessage: hide === undefined ? !this.state.hideMessage : hide,
        })
    };

    renderRequestorGroups = () => {
        const {
            hasSavedRequestorGroup,
            numberOfRequestorGroups,
            userRequestorGroups,
            savedRequestorGroup: { requestorGroupName, requestorGroupId },
        } = this.props
        const requestorGroupKey = hasSavedRequestorGroup ? requestorGroupName + '::' + requestorGroupId : null

        const requestorGroupOptions =
            numberOfRequestorGroups > 1
                ? userRequestorGroups.requestorGroups.map(rg => ({
                      value: rg.requestorGroupName + '::' + rg.requestorGroupId,
                      label: rg.requestorGroupName,
                  }))
                : []

        return (
            requestorGroupOptions.length > 0 &&
            <div className="hide-for-print">
                <div className="cart-summary__requestor-group">
                    <Select
                        value={requestorGroupKey}
                        options={requestorGroupOptions}
                        placeholder={t('Select Requestor Group...')}
                        clearable={false}
                        onChange={this.selectRequestorGroup}
                        autoBlur
                    />
                    <div
                        className={cn(
                            { hide: this.state.hideMessage },
                            'cart-summary__label ion-ios-information small-8'
                        )}>
                        {t(requestorGroupMessage)}
                    </div>
                </div>
                <div className="cart-summary__hsep" />
            </div>
        )
    };

    render() {
        const {
            children,
            locale,
            ewrFeeAmount,
            hideEWR,
            isCanada,
            isCartPage,
            isEMEA,
            isPastShippingOptions,
            isStockAndPriceDisplayDisabled,
            saveLineLevels,
            savedCarrier,
            shippingCost,
            showTax,
            showBlankTax,
            showBlankShipping,
            suppressShippingEstimateInCart,
            showShippingHelpText,
            showShippingAfterCarrierSelection,
            showRequestorGroupDropdown,
            taxCost,
            useShoppingRequest,
            pstTaxCost,
            gstHstTaxCost,
            hideSaveForLater,
            cart: { subTotal, totalCount, currency },
        } = this.props

        const shouldShowBlankTax = showBlankTax && !showTax
        const shouldShowBlankShipping =
            showBlankShipping || (showShippingAfterCarrierSelection && !isPastShippingOptions)
        const shouldShowShipCarrier = isPastShippingOptions || useShoppingRequest
        const shouldShowPstTax = pstTaxCost > 0 && useShoppingRequest
        const shouldShowHstGstTax = gstHstTaxCost > 0 && useShoppingRequest
        const shouldShowTaxCost = taxCost > -1 && !(shouldShowPstTax || shouldShowHstGstTax)
        const shouldShowEWR = !hideEWR && ewrFeeAmount > 0
        const shouldSuppressShippingEstimateInCart = isCartPage && suppressShippingEstimateInCart
        const hasThirdPartyAccountNumber = savedCarrier && savedCarrier.thirdPartyAccountNumber
        const shippingOrCarrierText = hasThirdPartyAccountNumber ? t('Charge Account') : t('Estimated Shipping')
        const freightCostTbd = savedCarrier && savedCarrier.option === "XD" || false

        const sumTotal =
            subTotal +
            ((shouldShowBlankShipping || shouldSuppressShippingEstimateInCart)? 0 : shippingCost) +
            (shouldShowBlankTax ? 0 : taxCost) +
            (shouldShowEWR ? ewrFeeAmount : 0) +
            (shouldShowPstTax ? pstTaxCost : 0) +
            (shouldShowHstGstTax ? gstHstTaxCost : 0)

        const taxLabel = isEMEA ?
            <Fragment>
                {t('Estimated VAT')}
                <span className="hide-for-print"><IWHelpIcon tooltip={t('Goods and services are invoiced at the price prevailing at time of acceptance of order. VAT is charged at the rate applicable at the time of invoicing or otherwise in accordance with the law.')}/></span>
            </Fragment> : t('Tax estimate')

        return (
            totalCount > 0 &&
            <div className="cart-summary-container">
                <div className="cart-summary">
                  {!isStockAndPriceDisplayDisabled &&
                    <div className='row section__header section__header--cyan align-middle is-collapse-child hide-for-print'>
                        <h3 className="columns section__header-title">
                            {t('Summary')}
                        </h3>
                    </div>}
                    <div>
                      {showRequestorGroupDropdown && this.renderRequestorGroups()}
                      {!isStockAndPriceDisplayDisabled &&
                        <div className="cart-summary__totals">
                            <SummaryRow
                                className="cart-summary__subtotal"
                                title={t('Subtotal')}
                                priceElement={<Currency value={subTotal} currencyCode={currency} />}
                            />
                            {!shouldSuppressShippingEstimateInCart &&
                                <SummaryRow
                                    className="cart-summary__shipping"
                                    title={
                                        <>
                                            {showShippingHelpText && <span className="hide-for-print">*</span>}
                                            {shippingOrCarrierText}
                                            {shouldShowShipCarrier &&
                                                savedCarrier &&
                                                !freightCostTbd &&
                                                !isEMEA &&
                                                <span>
                                                    <p className="no-margin-bot">
                                                        ({`${savedCarrier.name} ${savedCarrier.description}`})
                                                    </p>
                                                </span>}
                                        </>
                                    }
                                    priceElement={
                                        shouldShowBlankShipping ||
                                        freightCostTbd
                                            ? <span>--</span>
                                        : <Currency value={shippingCost} currencyCode={currency}/>
                                    }
                                />
                            }
                            {shouldShowEWR &&
                                <EWRFee currency={currency} ewrFee={ewrFeeAmount} locale={locale} isCanada={isCanada} />
                            }
                            {shouldShowTaxCost &&
                                <SummaryRow
                                    className="cart-summary__tax"
                                    title={taxLabel}
                                    priceElement={
                                        shouldShowBlankTax
                                            ? <span>--</span>
                                            : <Currency value={taxCost} currencyCode={currency} />
                                    }
                                />}
                            {shouldShowPstTax &&
                                <SummaryRow
                                    className="cart-summary__tax"
                                    title={t('PST / QST est.')}
                                    priceElement={<Currency value={pstTaxCost} currencyCode={currency} />}
                                />}
                            {shouldShowHstGstTax &&
                                <SummaryRow
                                    className="cart-summary__tax"
                                    title={t('GST / HST est.')}
                                    priceElement={
                                        <Currency value={gstHstTaxCost} currencyCode={currency} />
                                    }
                                />}
                            <div className="row is-collapse-child">
                                <div className="columns">
                                    <hr className="cart-summary__hline" />
                                </div>
                            </div>
                            <SummaryRow
                                className={'cart-summary__total'}
                                title={
                                    <>
                                        {shouldSuppressShippingEstimateInCart && <span>*</span>}
                                        {t('Total')}
                                    </>
                                }
                                priceElement={<Currency value={sumTotal} currencyCode={currency} />}
                            />
                        </div>
                      }
                    </div>
                    <div>
                        {children &&
                            React.cloneElement(children, {
                                showRequiredRequestorGroupMessage: () => this.toggleHideMessage(false),
                            })}
                        <div className="row is-collapse-child hide-for-print">
                          {!isStockAndPriceDisplayDisabled&&
                            <div className="columns">
                                {shouldSuppressShippingEstimateInCart ?
                                  <>
                                    <div className="cart-summary__shipping-footnote">
                                              <span className="cart__font-size--sm no-margin-bot">
                                                  {t('*Shipping charges may apply and are not included in total.')}
                                              </span>
                                    </div>
                                  </>
                                  :
                                  <>
                                    {showShippingHelpText &&
                                      <div className="cart-summary__shipping-footnote">
                                              <span className="cart__font-size--sm no-margin-bot">
                                                  {
                                                    t('*Shipping rates are calculated based on your default information. Other shipping rate options can be viewed and selected on the next page.')
                                                  }
                                              </span>
                                      </div>
                                    }
                                  </>
                                }
                            </div>
                          }
                        </div>
                    </div>
                    { !hideSaveForLater &&
                    <div className="hide-for-small-only">
                        <SaveForLater saveLineLevels={saveLineLevels} />
                    </div>
                    }
                </div>
            </div>
        )
    }
}

CartSummaryView.propTypes = {
    b2bLoginInfo: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    ewrFeeAmount: PropTypes.number.isRequired,
    hasSavedRequestorGroup: PropTypes.bool.isRequired,
    hideEWR: PropTypes.bool.isRequired,
    isCanada: PropTypes.bool.isRequired,
    isCartPage: PropTypes.bool,
    isEMEA: PropTypes.bool,
    isStockAndPriceDisplayDisabled: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    numberOfRequestorGroups: PropTypes.number,
    savedRequestorGroup: PropTypes.object.isRequired,
    saveLineLevels: PropTypes.bool.isRequired,
    shippingCost: PropTypes.number.isRequired,
    showBlankTax: PropTypes.bool.isRequired,
    showBlankShipping: PropTypes.bool.isRequired,
    showRequestorGroupDropdown: PropTypes.bool.isRequired,
    suppressShippingEstimateInCart: PropTypes.bool,
    showShippingHelpText: PropTypes.bool,
    showTax: PropTypes.bool.isRequired,
    taxCost: PropTypes.number.isRequired,
    userRequestorGroups: PropTypes.object,
    hideSaveForLater: PropTypes.bool,
}

CartSummaryView.defaultProps = {
    hideEWR: false,
    isCartPage: false,
    saveLineLevels: false,
    showBlankTax: false,
    showBlankShipping: false,
    showRequestorGroupDropdown: false,
    showTax: false,
    suppressShippingEstimateInCart: false,
}

export default CartSummaryView
