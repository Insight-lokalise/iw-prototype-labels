import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { connectToLocale } from "@insight/toolkit-react/lib/Locale/Locale";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import { checkoutOptionsGAE } from '@insight/toolkit-utils/lib/analytics'
import { t } from '@insight/toolkit-utils/lib/labels'
import ROUTES from './../../../../libs/routes'
import {
    IWButton,
    IWLoading,
    IWMessageBox,
    IWMessage,
    msgBox,
} from './../../../../libs/iw-components'
import {
    IWCheckboxField,
} from './../../../../libs/iw-components/iw-form'
import ShippingNotifications from './ShippingNotifications'
import CarrierOptions from './CarrierOptions'
import { createCarrierRequestBody } from './ShippingOptionsHelpers'
import { ShowIf } from './../../../../libs/higherOrderComponents'
import { navigateToSection } from '../../../../libs/routes/navigate'
import ScrollIntoView from '../../../../libs/routes/ScrollIntoView'
import { showCarrierChargeMessage, showShippingMethod } from '../../../../app/libs/utils'
import TaxExemption from './TaxExemption'


const missingCarrierError = 'A shipping carrier is required.'
const freightCostTbdError = `There has been an issue calculating shipping costs for this order. Either the freight cost is too large to calculate automatically or the address provided has returned an error. You may complete the order process, but once the order is placed you will be contacted with a quote for shipping costs before we can process the shipping. All totals are therefore showing as 'Estimated', as this price does not include shipping costs.`
const backorderMessage = 'Backordered items will ship when available.'

export class ShippingOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoadingData: true,
            thirdPartyCarrier: null,
            selectedTab: 0,
            selectedCarrier: null,
            carrier500Error: false,
            freightIsTbd: false,
            overrideTax: false,
            VASOptions: []
        }
      // @todo remove disable_feature_payment after pack one is merged with develop
      this.disable_feature_payment = false
    }

    componentDidMount() {
        this.props.getShoppingRequest().then(({value}) => {
            const isOnShipBillPay = this.props.accordionName === "SBP"
            const showBackOrderResult = value?.cart?.cartItems.some(cartItem => {
                const { quantity, availableStock: { regular, unlimited } } = cartItem
                if(quantity > regular && !unlimited) {
                  return true
                }
                return false
            })
            this.setState({
                showBackOrder: showBackOrderResult && isOnShipBillPay
            });
        })
        .catch((error) => {
            this.setState({
                showBackOrder: false
            });
            console.error(error)
        })
        Promise.all([
            this.props.getTaxExemptFromShoppingRequest(),
            this.props.getShippingCarriers(),
            this.props.getThirdPartyCarriers(),
        ]).then(([taxExemption, carriers]) => {
            let carriersArray = []
            let slsCarriersArray = []
            if (carriers.value && carriers.value.message && carriers.value.statusCode == 500) {
                // handle http 500 error for getShippingCarriers
                this.setState({ carrier500Error: true })
                carriersArray = null
                slsCarriersArray = null
            }
            else {
                carriersArray = carriers.value.carriers
                slsCarriersArray = carriers.value.slsCarriers
            }

            if(carriersArray[0] && carriersArray[0].shippingCode === 'XD' && carriersArray[0].carrier === 'OTHER') {
                const carrier = carriersArray[0]
                this.setState({freightIsTbd: true})
                this.setState({selectedCarrier: carrier})
                this.setState({carrierOption: {
                    description: carrier.shippingCondition,
                    name: carrier.carrier,
                    option: carrier.shippingCode,
                    price: carrier.price,
                    saturday: !!(Number(carrier.saturdayDelivery)),
                }})
            }

            this.setState({
              overrideTax: this.props.hasTaxOverride && taxExemption.value !== null && taxExemption.value.applyTaxCertificate,
              isLoadingData: false
            }, () => {
                msgBox.removeMsg('ShippingOptions','shipError')
                msgBox.removeMsg('ShippingOptions','500Error')
                msgBox.removeMsg('ShippingOptions', 'carrierTbd')

                if (carriersArray && carriersArray.length === 0 && slsCarriersArray && slsCarriersArray.length == 0) {
                    msgBox.addMsg('ShippingOptions', {
                        msgId: 'shipError',
                        text: t('Shipments to the specified country require a special ordering process. Please contact your account executive for assistance.'),
                        severity: 'error',
                    })
                }
                if(this.state.carrier500Error) {
                    msgBox.addMsg('ShippingOptions', {
                        msgId: '500Error',
                        severity: 'error',
                        text: t('A carrier cannot be identified with your current shipping location. Please contact your account rep for further assistance.'),
                    })
                }
                if(this.state.freightIsTbd && !this.props.isReadOnly) {
                    msgBox.addMsg('ShippingOptions', {
                        msgId: 'carrierTbd',
                        severity: 'error',
                        text: t(freightCostTbdError),
                    })
                }
            })
            /* scroll into view when component finished loading */
            if(!this.props.isReadOnly && !this.props.isCollapsed) {
                const thisComponent = ReactDOM.findDOMNode(this);
                thisComponent && ScrollIntoView(thisComponent, -200)
            }
        })
    }

    handleCarrierAccountSelect = carrierAccount => {
        this.setState({ carrierAccount })
    };

    handleCarrierAsDefault = carrierDefault => {
        this.setState({ carrierDefault })
    };

    handleCarrierOptionSelect = (carrierOption, selectedCarrier = null) => {
        this.setState({ carrierOption, selectedCarrier })
    };

    handleVASOptionSelect = (isChecked, selectedVASOption) => {
      if(isChecked){
        this.setState({ VASOptions : [
          ...this.state.VASOptions,
            `${selectedVASOption.id}: ${selectedVASOption.description}`,
        ] })
      }else{
        const filteredOptions = this.state.VASOptions.filter(option => {
          return option !== `${selectedVASOption.id}: ${selectedVASOption.description}`
        })
        this.setState({ VASOptions : filteredOptions })
      }
    }

    handleFormSubmit = values => {
        if (!this.state.carrierOption) {
            msgBox.addMsg('ShippingOptions', {
                msgId: 'missingCarrierOption',
                severity: 'error',
                text: t(missingCarrierError),
            })
            return
        }
        msgBox.removeMsg('ShippingOptions', 'missingCarrierOption')

        const thirdPartyCarrier = this.state.carrierAccount ||
            this.props.thirdPartyCarriers.find(carrier => carrier.carrierName === values.thirdPartyCarrier)
        const toSubmit = createCarrierRequestBody({
            ...values,
            carrierOption: this.state.carrierOption,
            shipComplete: !!values.shipComplete,
            thirdPartyCarrier,
            vasOptions: this.state.VASOptions
        })
        const taxExemptionPayload = {
          number: this.props.taxExemptionNumber,
          applyTaxCertificate: this.state.overrideTax,
        }
      Promise.all([
        this.props.saveCarrierToShoppingRequest(toSubmit),
        !this.disable_feature_payment && this.props.hasTaxOverride ? this.props.updateTaxExemption(taxExemptionPayload) : null,
      ]).then(() => {
                const { history, setActiveIndex, isB2BUser } = this.props
                if (isB2BUser) {
                    this.props.validateReviewOrder()
                        .then(({ value }) => {
                            if (value.length > 0) {
                                msgBox.addMsg('SBP-header', {
                                    text: t('Errors must be corrected before saving.'),
                                    severity: 'error',
                                    scrollTo: '.SBP__messages',
                                })
                            } else {
                                msgBox.clear('SBP-header')
                                history.push({ pathname: ROUTES.CART_TRANSFER })
                                setActiveIndex('SBP', 0)
                                setActiveIndex('LineLevel', 0)
                            }
                        })
                } else {
                    this.props.proceedToCheckout({source:'CARRIER'})
                        .then(({value})=>{
                            const { checkoutState } = value
                            navigateToSection(history, checkoutState, setActiveIndex)
                        })
                }
            })
            .then(this.props.isQuickCheckout ? Promise.resolve() : this.props.getTaxAndEWRFee)
            .then(() => {
                checkoutOptionsGAE(2, this.props.selectedShippingOption.name, this.props.isQuickCheckout)
                if (this.props.isB2BUser) {
                    const { eProcType, extrinsic, token } = this.props.b2bProps
                    return this.props.triggerTransferCartAfterGetCart({ cancel: false, eProcType, extrinsic, token })
                }
            })
        if (values["shipping-options__samd"] && this.state.selectedCarrier) {
            this.props.updateCarrierDefault(this.state.selectedCarrier.carrierId);
        }
    };

    removeCarrierSelection = () => {
        this.handleCarrierOptionSelect(undefined)
        this.props.removeCarrierSelection()
    };

    render() {
        if (this.state.isLoadingData) return <IWLoading />
        const {
            isReadOnly,
            isCollapsed,
            selectedShippingOption,
            selectedShipping: { additionalShippingNotificationEmail, notes, shipComplete },
            shippingCarriers: { slsCarriers, carriers, transportsToDetermine },
            isStockAndPriceDisplayDisabled,
            isVASEnabled,
            context: { isCES },
        } = this.props
        const isEditable = !isReadOnly && !isCollapsed
        const { carrier500Error, freightIsTbd, showBackOrder } = this.state
        const showVAS = !isCES && isVASEnabled
        return (
            <section>
                { isEditable &&
                    <form onSubmit={this.props.reduxForm.handleSubmit(this.handleFormSubmit)}>
                        <div className="row expanded is-collapse-child">
                            <div className="column">
                                {showBackOrder && isCES && (
                                    <span className={`o-grid o-grid--center c-stock--error u-margin-bot-small`}>
                                        <span className="o-grid__item o-grid__item--shrink c-stock__icon">
                                            <span className="o-grid o-grid--full-height">
                                            <Icon size="small" icon= 'alert' type= 'error' />
                                            </span>
                                        </span>
                                        <span className="o-grid__item o-grid__item--shrink u-text-bold">
                                            { t(backorderMessage) }
                                        </span>
                                    </span>
                                )}
                                <IWMessageBox
                                    boxId="ShippingOptions"
                                    Content={props =>
                                        <div>
                                            {props.messages.map(msg => <IWMessage className="expanded" key={msg.text} {...msg} />)}
                                        </div>}
                                />
                                {transportsToDetermine &&
                                    showCarrierChargeMessage()
                                }
                                {freightIsTbd ? null : (<CarrierOptions
                                    billMyCarrier={this.props.billMyCarrier}
                                    canShowThirdPartyCarrier={this.props.canShowThirdPartyCarrier}
                                    carriers={carriers}
                                    clearSetAsMyDefault={fieldName => this.props.clearSetAsMyDefault('ShippingOptions',fieldName,false)}
                                    forceThirdPartyCarrier={this.props.forceThirdPartyCarrier}
                                    handleCarrierAccountSelect={this.handleCarrierAccountSelect}
                                    handleCarrierAsDefault={this.handleCarrierAsDefault}
                                    handleCarrierOptionSelect={this.handleCarrierOptionSelect}
                                    handleVASOptionSelect={this.handleVASOptionSelect}
                                    isEditChkoutDefaultFavs={this.props.isEditChkoutDefaultFavs}
                                    isLimitedUser={this.props.isLimitedUser}
                                    removeCarrierSelection={this.removeCarrierSelection}
                                    selectedShippingOption={selectedShippingOption}
                                    slsCarriers={slsCarriers}
                                    thirdPartyCarriers={this.props.thirdPartyCarriers}
                                    isEMEA={this.props.isEMEA}
                                    isCES={isCES}
                                    showVAS={showVAS}
                                    isStockAndPriceDisplayDisabled={isStockAndPriceDisplayDisabled}
                                />)}

                                <ShippingNotifications isCES={isCES} canSaveASNEmails={this.props.canSaveASNEmails} />
                                {this.props.hasValidQtyForShipComplete &&
                                    <ShowIf webGroupPermissions="allow_shipping_complete">
                                        <fieldset className="fieldset">
                                            <legend>
                                                <h4 className="fieldset__heading">
                                                    {t('Other options')}
                                                </h4>
                                            </legend>
                                            <br />
                                            <div className="row">
                                                <div className="column">
                                                    <IWCheckboxField
                                                        label={t('Ship complete (Can cause delays in order processing)')}
                                                        name="shipComplete"
                                                        className="form__label--inline"
                                                    />
                                                    <p>
                                                        {t('* If partial shipments are NOT acceptable, please indicate')}
                                                        <strong>
                                                            {' '}{t('Ship complete.')}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </ShowIf>}
                              { !this.disable_feature_payment && this.props.hasTaxOverride &&
                                <TaxExemption
                                  hasTaxOverride={this.props.hasTaxOverride}
                                  setOverrideTax={(overrideTax)=>{this.setState({overrideTax})}}
                                  overrideTax={this.state.overrideTax}
                                />
                              }

                            </div>
                        </div>
                        <div className="row expanded is-collapse-child align-right text-right">
                            <div className="column small-12 medium-shrink">
                                {!carrier500Error &&
                                    <IWButton className="expanded section__button no-margin-bot" type="submit">
                                    {t('Continue')}
                                    </IWButton>
                                }
                            </div>
                        </div>
                    </form>
                }
                { isReadOnly &&
                    <div className="row expanded is-collapse-child">
                        { transportsToDetermine &&
                            <div className="columns small-12 medium-12">
                                {showCarrierChargeMessage()}
                            </div>
                        }
                        <div className="columns small-12 medium-6">
                            <label className="form__label--readonly">{isCES ? t('Shipping method:') : t('Shipping carrier:')}</label>
                            <p>{showShippingMethod({name: selectedShippingOption.name, description: selectedShippingOption.description, isCES, isEMEA: this.props.isEMEA, freightIsTbd})}</p>
                        </div>
                        { this.props.canShowThirdPartyCarrier && selectedShippingOption.thirdPartyDisplayName &&
                            <div className="columns small-12 medium-6">
                                <label className="form__label--readonly">{t('Carrier account:')}</label>
                                <p>{`${selectedShippingOption.thirdPartyDisplayName}`}</p>
                            </div>
                        }
                        <div className="columns small-12 medium-6" data-private="true">
                            <label className="form__label--readonly">{t('Notification email(s):')}</label>
                            { additionalShippingNotificationEmail && additionalShippingNotificationEmail.length > 0 &&
                                <div>
                                    { additionalShippingNotificationEmail.split(';')
                                        .map(
                                            (email, index) =>
                                            (index < additionalShippingNotificationEmail.split(';').length-1) ?
                                                <p className="no-margin-bot" key={email}>{`${email},`}</p> :
                                                <p className="no-margin-bot" key={email}>{email}</p>
                                            )
                                    }
                                </div>
                            }
                            {(!additionalShippingNotificationEmail || additionalShippingNotificationEmail.length == 0) &&
                                <div>{'-'}</div>
                            }
                        </div>
                        {!isCES &&
                            <div className="columns small-12 medium-6">
                                <label className="form__label--readonly">{t('Shipping related notes:')}</label>
                                <p>{notes ? notes : '-'}</p>
                            </div>
                        }
                        { shipComplete &&
                            <div className="columns small-12 medium-6">
                                <label className="form__label--readonly">{t('Other option:')}</label>
                                <p>{t('Ship complete')}</p>
                            </div>
                        }
                    </div>
                }
            </section>
        )
    }
}


export default reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    form: 'ShippingOptions',
    propNamespace: 'reduxForm',
    pure: true,
})(connectToLocale(ShippingOptions))

ShippingOptions.defaultProps = {
    isEditChkoutDefaultFavs: false,
    isLimitedUser: false,
    isQuickCheckout: false,
}

ShippingOptions.propTypes = {
    billMyCarrier: PropTypes.bool.isRequired,
    canSaveASNEmails: PropTypes.bool.isRequired,
    canShowThirdPartyCarrier: PropTypes.bool.isRequired,
    clearSetAsMyDefault: PropTypes.func,
    forceThirdPartyCarrier: PropTypes.bool.isRequired,
    getShippingCarriers: PropTypes.func.isRequired,
    getThirdPartyCarriers: PropTypes.func.isRequired,
    hasValidQtyForShipComplete: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    isEditChkoutDefaultFavs: PropTypes.bool,
    isLimitedUser: PropTypes.bool,
    isEMEA: PropTypes.bool,
    isReadOnly: PropTypes.bool.isRequired,
    isQuickCheckout: PropTypes.bool,
    isStockAndPriceDisplayDisabled: PropTypes.bool,
    isVASEnabled: PropTypes.bool,
    reduxForm: PropTypes.object.isRequired,
    removeCarrierSelection: PropTypes.func.isRequired,
    saveCarrierToShoppingRequest: PropTypes.func.isRequired,
    selectedShipping: PropTypes.object.isRequired,
    selectedShippingOption: PropTypes.shape({
        carrier: PropTypes.object,
    }),
    setActiveIndex: PropTypes.func.isRequired,
    shippingCarriers: PropTypes.shape({
        slsCarriers: PropTypes.arrayOf(PropTypes.object),
        carriers: PropTypes.arrayOf(PropTypes.object),
        transportsToDetermine: PropTypes.bool,
    }),
    thirdPartyCarriers: PropTypes.arrayOf(PropTypes.object),
    context: PropTypes.shape({
        isCES: PropTypes.bool.isRequired,
    }),
}
