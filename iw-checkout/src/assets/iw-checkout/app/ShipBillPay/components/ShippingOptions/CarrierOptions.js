import React, {PureComponent} from 'react'
import groupBy from 'lodash-es/groupBy'
import map from 'lodash-es/map'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { t } from '@insight/toolkit-utils/lib/labels'

import {IWSetAsMyDefault} from '../../../../libs/iw-components/iw-setAsMyDefault'
import {
    msgBox,
} from './../../../../libs/iw-components'
import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import {
    IWCheckboxField,
    IWRadioField,
    IWSelectField,
} from './../../../../libs/iw-components/iw-form'

import {normalizeCarrierValue} from './ShippingOptionsHelpers'
import ValueAddedServices from "./ValueAddedServices";

export default class CarrierOptions extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            carrierAccount: null,
            carrierTabData: props.carrierTabData,
            isCarrierAccountSelected: false,
            mappedThirdPartyCarriers: [],
            selectedCarrierName: null,
            selectedTab: 0,
            selectedCarrier: null,
        }
    }

    componentDidMount() {
        const {
            carriers,
            forceThirdPartyCarrier,
            selectedShippingOption,
            slsCarriers,
            thirdPartyCarriers,
            isEMEA
        } = this.props
        const hasSelectedShippingOption = Object.keys(selectedShippingOption).length

        let allCarriers = []
        if(carriers instanceof Array)             
            allCarriers = isEMEA ? carriers : slsCarriers.concat(carriers)

        const carriersWithValue = allCarriers.map(option => ({
            ...option,
            value: normalizeCarrierValue(option),
        }))
        const carrierTabData = groupBy(carriersWithValue, 'carrier')

        const savedCarrierAccount = thirdPartyCarriers.find(
            carrier => carrier.carrierAccountNumber === selectedShippingOption.thirdPartyAccountNumber
        )
        const defaultCarrierAccount = thirdPartyCarriers.find(carrier => carrier.defaultCarrierAccountNumber)

        const defaultCarrier = allCarriers.find( carrier => carrier.defaultCarrier === true );
        const defaultShippingOption = defaultCarrier ? { name: defaultCarrier.carrier, code: defaultCarrier.shippingCode, saturday: (defaultCarrier.saturdayDelivery!=="0") } : ''
        const newShippingOption = { name: selectedShippingOption.name, code: selectedShippingOption.option, saturday: selectedShippingOption.saturday };
        const selectedCarrier = this.getSelectedCarrier( allCarriers, newShippingOption.name, newShippingOption.code, newShippingOption.saturday)

        let selectedCarrierName = null
        if (hasSelectedShippingOption) {
            // Update parent with carrier price and description information
            const option = createCarrierOption(carrierTabData, selectedShippingOption)
            if (option && option.price !== undefined) {
                this.props.handleCarrierOptionSelect(option, selectedCarrier)
                this.setState({ selectedCarrier })
                selectedCarrierName = option.name.toUpperCase()
            }
        }

        const selectedCarrierAccount =
            savedCarrierAccount || defaultCarrierAccount || (forceThirdPartyCarrier && thirdPartyCarriers[0])
        const selectedAccountNumber = selectedCarrierAccount && selectedCarrierAccount.carrierAccountNumber

        const selectedTabName = hasSelectedShippingOption
            ? selectedShippingOption.name.toUpperCase()
            : selectedCarrierAccount && selectedCarrierAccount.carrierType

        const mappedThirdPartyCarriers = thirdPartyCarriers.map(carrier => ({
            label: carrier.carrierAccountDisplayValue,
            value: carrier.carrierAccountNumber,
        }))
        this.setState(
            {
                carriersWithValue,
                allCarriers,
                carrierTabData,
                defaultShippingOption,
                mappedThirdPartyCarriers,
                selectedCarrierName,
                selectedShippingOption: newShippingOption,
                selectedTab: isEMEA ? null : selectedTabName,
            },
            () => {
                if (this.props.billMyCarrier && (selectedAccountNumber || forceThirdPartyCarrier)) {
                    this.selectCarrierAccount(selectedAccountNumber)
                    this.isCarrierAccountSelected(true)
                }
            }
        )
    }

    getSelectedCarrier(allCarriers, name, code, saturday) {
        const currentCarrier = allCarriers.find(
            carrier => {
                return carrier.carrier == name && carrier.shippingCode === code && (carrier.saturdayDelivery!=="0") === saturday
            }
        )
        return currentCarrier;
    }

    clearOption() {
        const carrierAccountError = t(
            'The chosen carrier account number does not match the shipping option selected. Please select either a different shipping option or carrier account number.'
        )
        const { carrierAccount } = this.state
        if (carrierAccount) {
            const { carrierType } = carrierAccount
            const hasValidOptionSelected = carrierType === this.state.selectedCarrierName
            if (!hasValidOptionSelected) {
                this.props.removeCarrierSelection()
                msgBox.addMsg('ShippingOptions', {
                    text: carrierAccountError,
                    severity: 'info',
                    msgId: 'carrierOptionRemoved',
                })
                this.handleTabSelect(carrierType)
            }

        }
    }

    handleTabSelect = selectedTab => {
        this.setState({ selectedTab, selectedCarrier: null })
        this.props.removeCarrierSelection()
    };

    isCarrierAccountSelected = bool => {
        this.setState({ isCarrierAccountSelected: bool })
        if (bool) {
            this.clearOption()
        }
    };

    selectCarrierAccount = value => {
        const carrierAccount = this.props.thirdPartyCarriers.find(
            carrier => carrier.carrierAccountNumber === value
        )
        this.props.handleCarrierAccountSelect(carrierAccount)
        this.setState({ carrierAccount }, this.clearOption)
    };

    selectCarrierOption = (event, value) => {
        if (event.currentTarget && event.currentTarget.disabled) {
            // React improperly triggers onChange when a disabled
            // radio button is double clicked in IE
            event.preventDefault()
            return
        }
        const parsedValue = JSON.parse(value)
        const option = createCarrierOption(this.state.carrierTabData, parsedValue)
        const shippingOption = { name: option.name, code: option.option, saturday: option.saturday }
        const selectedCarrier = this.getSelectedCarrier(this.state.allCarriers, option.name, option.option, option.saturday)
        this.props.handleCarrierOptionSelect(option, selectedCarrier)

        this.setState({
            selectedCarrierName: option && option.name.toUpperCase(),
            selectedShippingOption: shippingOption,
            selectedCarrier,
        })
        msgBox.removeMsg('ShippingOptions', 'carrierOptionRemoved')
    };

    render() {
        const billMyCarrier = t('Bill my carrier')
        const billMyCarrierAccount = t('Bill my carrier account')
        const carriersHelpText = t('Select a specific shipping option from the list below:')
        const chooseACarrier = t('Choose a carrier')
        const noCarrierPreference = t('No carrier preference')
        const shipComplete1 = t('You can bill your carrier account for this purchase. Just check the')
        const shipComplete2 = t('box and select the account from the list or use the search feature to search for an account.')
        const thirdPartyCarrierText = t('Third party carrier')
        const {
            carriersWithValue,
            carrierAccount,
            carrierTabData,
            defaultShippingOption,
            isCarrierAccountSelected,
            mappedThirdPartyCarriers,
            selectedShippingOption,
            selectedTab,
            selectedCarrier,
        } = this.state
        const {
            canShowThirdPartyCarrier,
            clearSetAsMyDefault,
            forceThirdPartyCarrier,
            handleVASOptionSelect,
            isEditChkoutDefaultFavs,
            isLimitedUser,
            isEMEA,
            isCES,
            isStockAndPriceDisplayDisabled,
            showVAS
        } = this.props
        const carrierOptionsText = isCES ? '' : t('Carriers')
        const carrierOptionsLabelText = isCES ? '' : t('Choose from the following shipping methods (Lowest prices available, carriers may vary)')
        const allowSetAsMyDefault = !isCES && !isLimitedUser && isEditChkoutDefaultFavs && (!!selectedCarrier && selectedCarrier.showSetAsDefault)

        const normalizedCarrierData = map(carrierTabData, (options, index) => {
            const name = options[0].carrier
            const carrierName = name === 'SLS' ? noCarrierPreference : name
            return { label: carrierName, value: index.toUpperCase() }
        })
        return (
            <fieldset className="fieldset u-margin-bot-none">
                <div className="row expanded">
                    <div className="columns small-12">
                        <IWSetAsMyDefault className="edit-shipping-carrier"
                                          clearSetAsMyDefault={fieldName => clearSetAsMyDefault(fieldName)}
                                          defaultValue={JSON.stringify(defaultShippingOption)}
                                          label={carrierOptionsText}
                                          labelClassName={"fieldset__heading"}
                                          name={"shipping-options__samd"}
                                          onChange={this.handleChange}
                                          show={allowSetAsMyDefault}
                                          value={JSON.stringify(selectedShippingOption)}>
                            {(isEMEA || isCES) ? null : <p>{carriersHelpText}</p>}
                            <div className='row expanded'>
                                {(isEMEA || isCES) ? null : (<div className='column small-12 medium-4'>
                                    <Select
                                        className="Select__shipping-carrier"
                                        value={selectedTab}
                                        onChange={this.handleTabSelect}
                                        options={normalizedCarrierData}
                                        searchable={normalizedCarrierData.length > 1}
                                        placeholder={t('Select a shipping carrier')}
                                        noResultsText={t('Carriers not found')}
                                        clearable={false}
                                        autoBlur
                                        simpleValue
                                        disabled={normalizedCarrierData.length === 0}
                                    />
                                </div>)}
                                
                                <div className='column small-12'>
                                    {isEMEA && carriersWithValue ? 
                                        (<IWRadioField disabled={isCarrierAccountSelected && areDifferentCarriers(name, carrierAccount)}
                                                        label={carrierOptionsLabelText}
                                                        name="carrierOption"
                                                        onChange={this.selectCarrierOption}
                                                        optionRenderer={isStockAndPriceDisplayDisabled ? CarrierOptionNoPrice : CarrierOption}
                                                        radioOptions={carriersWithValue} />) : 
                                    (map(carrierTabData, (options, key) => {
                                        if (selectedTab === key.toUpperCase()) {
                                            const name = options[0].carrier
                                            const vasConfig = options[0].vasConfig
                                            const isDisabled =
                                                isCarrierAccountSelected && areDifferentCarriers(name, carrierAccount)
                                            return (
                                                <div>
                                                  <IWRadioField key={key}
                                                      disabled={isDisabled}
                                                      label={carrierOptionsLabelText}
                                                      name="carrierOption"
                                                      onChange={this.selectCarrierOption}
                                                      optionRenderer={isStockAndPriceDisplayDisabled ? CarrierOptionNoPrice : CarrierOption}
                                                      radioOptions={options}
                                                  />
                                                  { showVAS && vasConfig && vasConfig.length > 0 &&
                                                    <ValueAddedServices
                                                      handleVASOptionSelect={handleVASOptionSelect}
                                                      vasOptions={vasConfig}
                                                    />
                                                  }
                                                </div>
                                            )
                                        }
                                    }))}
                                </div>
                            </div>
                        </IWSetAsMyDefault>
                    </div>
                </div>  
                {canShowThirdPartyCarrier &&
                    mappedThirdPartyCarriers.length > 0 &&
                    <>
                    <br />
                    <div className="row expanded">
                        <div className="column small-12 medium-6">
                            <p>
                                {shipComplete1}
                                <strong>
                                    {` ${billMyCarrier} `}
                                </strong>
                                {shipComplete2}
                            </p>
                            <IWCheckboxField
                                className="form__label--inline"
                                disabled={forceThirdPartyCarrier}
                                label={billMyCarrierAccount}
                                name="billMyCarrier"
                                onChange={(_, checked) => this.isCarrierAccountSelected(checked)}
                                showChildIfChecked>
                                <IWSelectField
                                    hideLabel
                                    label={thirdPartyCarrierText}
                                    name="thirdPartyCarrier"
                                    onChange={(_, option) => this.selectCarrierAccount(option.value)}
                                    required
                                    selectElement={
                                        <Select
                                            className="Select__carrier-account"
                                            options={mappedThirdPartyCarriers}
                                            searchable={mappedThirdPartyCarriers.length > 1}
                                            placeholder={chooseACarrier}
                                            noResultsText={`${t('Carrier account not found')}.`}
                                            clearable={false}
                                            autoBlur
                                        />
                                    }
                                />
                            </IWCheckboxField>
                        </div>
                    </div>
                    </>}
                <hr />
            </fieldset>
        )
    }
}

function CarrierOption(option) {
    return (
        <span>
            <strong>
                {t(option.shippingCondition)}
            </strong>
            {' - '}
            <Currency value={option.price} currencyCode={option.currency} />
        </span>
    )
}

function CarrierOptionNoPrice(option) {
  return (
    <span>
      <strong>
        {t(option.shippingCondition)}
      </strong>
    </span>
  )
}
function findCarrierTabIndex(carrierTabData, carrierName) {
    if (!carrierName) return 0
    return Object.keys(carrierTabData).reduce(
        (prev, key, idx) => (key.toUpperCase() === carrierName.toUpperCase() ? idx : prev),
        0
    )
}

function createCarrierOption(carrierTabData, { name, option, saturday }) {
    if (!carrierTabData[name]) return undefined
    const availableOption = carrierTabData[name].find(optionData => optionData.shippingCode === option)
    return {
        description: availableOption && availableOption.shippingCondition,
        name,
        option,
        price: availableOption && availableOption.price,
        saturday: saturday || !!(availableOption && Number(availableOption.saturdayDelivery)),
    }
}

function areDifferentCarriers(carrierName, carrierAccount) {
    return !!carrierAccount && carrierAccount.carrierType.toUpperCase() !== carrierName.toUpperCase()
}

CarrierOptions.propTypes = {
    billMyCarrier: PropTypes.bool.isRequired,
    canShowThirdPartyCarrier: PropTypes.bool.isRequired,
    carriers: PropTypes.array.isRequired,
    clearSetAsMyDefault: PropTypes.func,
    forceThirdPartyCarrier: PropTypes.bool.isRequired,
    handleCarrierAccountSelect: PropTypes.func.isRequired,
    handleCarrierOptionSelect: PropTypes.func.isRequired,
    handleCarrierAsDefault: PropTypes.func.isRequired,
    isEditChkoutDefaultFavs: PropTypes.bool.isRequired,
    isLimitedUser: PropTypes.bool.isRequired,
    isStockAndPriceDisplayDisabled : PropTypes.bool,
    isEMEA: PropTypes.bool,
    removeCarrierSelection: PropTypes.func.isRequired,
    selectedShippingOption: PropTypes.object.isRequired,
    slsCarriers: PropTypes.array.isRequired,
    thirdPartyCarriers: PropTypes.array.isRequired,
    isCES: PropTypes.bool.isRequired,
}
