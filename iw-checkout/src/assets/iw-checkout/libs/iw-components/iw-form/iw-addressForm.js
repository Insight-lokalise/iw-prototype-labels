import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { untouch, change as resetField } from 'redux-form'
import { t } from '@insight/toolkit-utils/lib/labels'
import {
  IWTextField,
  IWPostalCodeField,
  IWSelectField,
  IWCheckboxField,
} from './'
import { ShowIf } from './../../higherOrderComponents'
import { selector_countryCode } from './../../Insight/selectors'
import {
  selector_isLimitedUser,
  selector_billingCountry,
} from '../../../app/LineLevel/selectors'
import {
  fetchCountries,
  fetchStatesByCountryCode,
} from './../../models/Address/address'
import { selector_isAPAC, selector_isEMEA } from './../../User/selectors'

import { AttentionFormSection } from './../../../app/ShipBillPay/components/AddressSection/AttentionFormSection'

export class IWAddressForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countriesList: [],
      statesList: [],
      zipCodeLength: 5,
      mandatoryState: false,
      mandatoryZipCode: false,
    }
  }

  componentDidMount() {
    // if EMEA, prepopulate states using billing country
    // if not EMEA, prepopulate states using country code of locale cookie
    const countryCode =
      this.props.isEMEA && this.props.billingCountry
        ? this.props.billingCountry
        : this.props.countryCode

    Promise.all([fetchCountries(), fetchStatesByCountryCode(countryCode)]).then(
      ([countries, states]) => {
        const { mandatoryState, mandatoryZipCode, zipCodeLength } =
          this.getCurrentCountry(countries, countryCode)
        this.setState({
          ...this.state,
          countriesList: countries,
          statesList: states,
          mandatoryState,
          mandatoryZipCode,
          zipCodeLength,
        })
      }
    )
  }

  componentWillUnmount() {
    const countryCode =
      this.props.isEMEA && this.props.billingCountry
        ? this.props.billingCountry
        : this.props.countryCode
    const formName = this.props.isShipping
      ? 'ShippingAddress'
      : 'BillingAddress'
    this.resetMandatoryFields()
    this.props.resetField(formName, 'country', countryCode)
    this.props.untouch(formName, 'country')
  }

  handleCountryChange = (_, countryCode) => {
    this.resetMandatoryFields()
    fetchStatesByCountryCode(countryCode).then((states) => {
      const { mandatoryState, mandatoryZipCode, zipCodeLength } =
        this.getCurrentCountry(this.state.countriesList, countryCode)
      this.setState({
        ...this.state,
        addressCountryCode: countryCode,
        statesList: states,
        mandatoryState,
        mandatoryZipCode,
        zipCodeLength,
      })
    })
  }

  resetMandatoryFields = () => {
    const formName = this.props.isShipping
      ? 'ShippingAddress'
      : 'BillingAddress'
    this.props.resetField(formName, 'zipCode', '')
    this.props.untouch(formName, 'zipCode')
    this.props.resetField(formName, 'state', '')
    this.props.untouch(formName, 'state', '')
  }

  // get current country from countries list
  getCurrentCountry = (countryList, countryCode) =>
    countryList.find((country) => country.countryCode === countryCode)

  render() {
    const address1Tooltip = t(
      'Full physical address, including suite, apartment, unit number, etc.'
    )
    const address2Tooltip = t('Additional street address information')

    const mappedStates = this.state.statesList.map((state) => ({
      displayName: state.value,
      value: state.key,
    }))
    const mappedCountries = this.state.countriesList.map((country) => ({
      displayName: country.country,
      value: country.countryCode,
    }))
    return (
      <div className="row expanded is-collapse-child">
        <div className="columns small-12 medium-6">
          <IWTextField
            name="companyName"
            label={t('Company')}
            maxLength={40}
            required
          />
          <IWTextField
            name="street1"
            label={t('Street address line 1')}
            tooltip={address1Tooltip}
            showHelpIcon
            required
          />
          <IWTextField
            name="street2"
            label={t('Street address line 2')}
            tooltip={address2Tooltip}
            showHelpIcon
          />
          <div className="row">
            <div className="columns small-12 medium-6">
              <IWTextField name="city" label={t('City')} required />
            </div>
            {this.state.mandatoryState && (
              <div className="columns small-12 medium-6">
                <IWSelectField
                  name="state"
                  label={t('State/Province')}
                  placeholder={t('Select a state/province')}
                  optionsArrayOrFunction={mappedStates}
                  required={this.state.mandatoryState}
                />
              </div>
            )}
          </div>
          <div className="row">
            {this.state.mandatoryZipCode && (
              <div className="columns small-12 medium-6">
                <IWPostalCodeField
                  countryCode={this.state.addressCountryCode}
                  name="zipCode"
                  label={t('ZIP/Postal code')}
                  zipCodeLength={this.state.zipCodeLength}
                  required={this.state.mandatoryZipCode}
                />
              </div>
            )}
            <div className="columns small-12 medium-6">
              <IWSelectField
                name="country"
                label={t('Country')}
                placeholder={t('Select a country')}
                optionsArrayOrFunction={mappedCountries}
                required
                disabled={this.props.disableCountrySelect}
                onChange={this.handleCountryChange}
              />
            </div>
          </div>
        </div>
        <div className="columns small-12 medium-6">
          {!this.props.hideAttentionForm && (
            <AttentionFormSection
              name="attentionForm"
              requireAttentionLine={this.props.requireAttentionLine}
              isAPAC={this.props.isAPAC}
              isEMEA={this.props.isEMEA}
            />
          )}
          {!this.props.isLimitedUser && (
            <ShowIf permissions="edit_chkout_default_favs">
              <section>
                <IWCheckboxField
                  name="setNickName"
                  label={t('Add to my favorites')}
                  showChildIfChecked
                  className="form__label--inline"
                >
                  <IWTextField
                    name="nickNameGiven"
                    label={t('Favorite name')}
                    placeholder={t('Add favorite address name')}
                    required
                    maxLength={20}
                  />
                </IWCheckboxField>
                <IWCheckboxField
                  name="useAsDefaultAddress"
                  label={t('Set as default')}
                  className="form__label--inline"
                />
              </section>
            </ShowIf>
          )}
          {!this.props.isLimitedUser && this.props.showPrivateShipTo && (
            <IWCheckboxField
              name="allowPrivateShipTo"
              label={t('Set as private ship to')}
              className="form__label--inline"
            />
          )}
        </div>
      </div>
    )
  }
}

IWAddressForm.defaultProps = {
  hideAttentionForm: false,
}

IWAddressForm.propTypes = {
  disableCountrySelect: PropTypes.bool,
  hideAttentionForm: PropTypes.bool.isRequired,
  hidePrivateShipTo: PropTypes.bool,
  isAPAC: PropTypes.bool.isRequired,
  isLimitedUser: PropTypes.bool.isRequired,
  requireAttentionLine: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    countryCode: selector_countryCode(state),
    isLimitedUser: selector_isLimitedUser(state),
    isAPAC: selector_isAPAC(state),
    isEMEA: selector_isEMEA(state),
    billingCountry: selector_billingCountry(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetField,
      untouch,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(IWAddressForm)
