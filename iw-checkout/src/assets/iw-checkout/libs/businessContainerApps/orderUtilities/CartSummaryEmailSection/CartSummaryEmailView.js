import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import cn from 'classnames'

import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import { t } from '@insight/toolkit-utils/lib/labels'
import SummaryRow from '../../../../libs/businessContainerApps/cartSummary/components/SummaryRow'
import EWRFee from '../../../../libs/businessContainerApps/cartSummary/components/EWRFee'

export class CartSummaryEmailView extends React.PureComponent {
    constructor(props) {
        super(props)
    }


    render() {
        const {
            locale,
            ewrFeeAmount,
            hideEWR,
            isCanada,
            isEMEA,
            isPastShippingOptions,
            savedCarrier,
            shippingCost,
            showTax,
            showBlankTax,
            showBlankShipping,
            showShippingHelpText,
            showShippingAfterCarrierSelection,
            taxCost,
            useShoppingRequest,
            pstTaxCost,
            gstHstTaxCost,
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
        const hasThirdPartyAccountNumber = savedCarrier && savedCarrier.thirdPartyAccountNumber
        const shippingOrCarrierText = hasThirdPartyAccountNumber ? t('Charge Account') : t('Shipping estimate')

        const sumTotal =
            subTotal +
            (shouldShowBlankShipping ? 0 : shippingCost) +
            (shouldShowBlankTax ? 0 : taxCost) +
            (shouldShowEWR ? ewrFeeAmount : 0) +
            (shouldShowPstTax ? pstTaxCost : 0) +
            (shouldShowHstGstTax ? gstHstTaxCost : 0)

        const taxLabel = isEMEA ? t('VAT') : t('Tax estimate')
 
    
        return (
            totalCount > 0 &&
            <div className="cart-summary-email-container hide hide-for-print">
                <div className="cart-summary">

                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                        <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                    {t('Summary')}
                                                </h3>
                                                </th>
                                                <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                    </tr></tbody></table>
                                </td></tr></tbody></table>
                        <table align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>

                                </td></tr></tbody></table>
                        <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>

                        <table align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                        
                        <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                            <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                <tbody>
                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                    <th className="small-12 large-6 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                        <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                        <tbody>
                                            <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('Subtotal')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <Currency value={subTotal} currencyCode={currency} />
                                                    </p>
                                                </th>
                                            </tr>
                                            <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>
                                                    {showShippingHelpText && <span>*</span>}
                                                    {shippingOrCarrierText}:
                                                    </strong>
                                                    {shouldShowShipCarrier &&
                                                        savedCarrier &&
                                                        <span>
                                                            &nbsp;({isEMEA ? null : `${savedCarrier.name} `}{`${savedCarrier.description}`})
                                                        </span>}                                                   
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    {shouldShowBlankShipping ? 
                                                        <span>--</span>
                                                        : <Currency value={shippingCost} currencyCode={currency} />}
                                                    </p>
                                                </th>                                            
                                            </tr>
                                            {shouldShowEWR &&
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('EWR')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <Currency value={ewrFeeAmount} currencyCode={currency} />
                                                        </p>
                                                    </th>                                            
                                                </tr>                                        
                                            }
                                            {shouldShowTaxCost &&
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{taxLabel}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {
                                                            shouldShowBlankTax
                                                                ? <span>--</span>
                                                                : <Currency value={taxCost} currencyCode={currency} />
                                                        }
                                                        </p>
                                                    </th>                                            
                                                </tr>
                                            }
                                            {shouldShowPstTax &&
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('PST / QST estimate')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <Currency value={pstTaxCost} currencyCode={currency} />
                                                        </p>
                                                    </th>                                            
                                                </tr>
                                            }
                                            {shouldShowHstGstTax &&
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('GST / HST estimate')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <Currency value={gstHstTaxCost} currencyCode={currency} />
                                                        </p>
                                                    </th>                                            
                                                </tr>
                                            }
                                            <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    
                                                    <hr className="cart-summary__hline" />
                            
                                                    <strong>{t('Total')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <Currency value={sumTotal} currencyCode={currency} />
                                                    </p>
                                                </th>                                            
                                            </tr>                                            
                                        </tbody>
                                        </table>
                                    </th>
                                </tr>
                                </tbody>
                            </table>
                        </td></tr></tbody></table>

                        </td></tr></tbody></table>                                                    
                               
                    </td></tr></tbody></table>                    
                    
                </div>
            </div>
        )
    }
}

CartSummaryEmailView.propTypes = {
    b2bLoginInfo: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    ewrFeeAmount: PropTypes.number.isRequired,
    hasSavedRequestorGroup: PropTypes.bool.isRequired,
    hideEWR: PropTypes.bool.isRequired,
    isCanada: PropTypes.bool.isRequired,
    isEMEA: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    numberOfRequestorGroups: PropTypes.number,
    savedRequestorGroup: PropTypes.object.isRequired,
    shippingCost: PropTypes.number.isRequired,
    showBlankTax: PropTypes.bool.isRequired,
    showBlankShipping: PropTypes.bool.isRequired,
    showRequestorGroupDropdown: PropTypes.bool.isRequired,
    showShippingHelpText: PropTypes.bool,
    showTax: PropTypes.bool.isRequired,
    taxCost: PropTypes.number.isRequired,
    userRequestorGroups: PropTypes.object,
}

CartSummaryEmailView.defaultProps = {
    hideEWR: false,
    showBlankTax: false,
    showBlankShipping: false,
    showRequestorGroupDropdown: false,
    showTax: false,
}

export default CartSummaryEmailView
