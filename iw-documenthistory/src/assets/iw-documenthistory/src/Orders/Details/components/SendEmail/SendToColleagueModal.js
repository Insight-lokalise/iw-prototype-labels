import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { getConfigLabels, t } from '@insight/toolkit-utils/lib/labels'
import { validateEmail, validateEmails } from '../../../../models/OrderDetails/OrderDetails'

import { IWInput, IWInputWithValidation, IWModal } from '../../../../libs/iw-components'
import { SendEmail } from './SendEmail'
import { ECOMMERCE_EMAIL, EMEA_ECOMMERCE_EMAIL } from '../../constants/Constants'

const NAME_FIELD = 'name'
const EMAIL_FIELD = 'email'
const EMAILS_FIELD = 'emails'
const COMMENT_FIELD = 'comment'

export default class SendToColleagueModal extends Component {
  constructor() {
    super()
    this.state = {
      configLabels: {},
      yourName: '',
      recpEmails: '',
      comments: '',
      emailFailure: false,
      recpEmailsValid: false,
    }
  }

  componentDidMount() {
    this.initialState = this.state
    const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")
    const country = localeValue.split('_')[1];

    getConfigLabels(country)
      .then((labels) => this.setState({ configLabels: labels }))
      .catch(() => this.setState({ configLabels: {} }))
  }

  handleChange = (value, type) => {
    switch (type) {
      case NAME_FIELD: {
        this.setState({ yourName: value })
        return value
      }
      case EMAILS_FIELD: {
        return this.setState({ recpEmails: value.target.value })
      }
      case COMMENT_FIELD: {
        this.setState({ comments: value })
        break
      }
      default:
        return null
    }
  }

  validField = (field, type) => {
    switch (type) {
      case EMAILS_FIELD: {
        const isValid = validateEmails(this.state.recpEmails)
        this.setState({ recpEmailsValid: isValid })
        return isValid
      }
      default:
        return null
    }
  }

  submitSendToColleague = (event) => {
    const isFormValid = this.state.yourName && this.state.recpEmailsValid
    const { configLabels } = this.state

    const sendToOptions = {
      emailLinkBase: this.props.applicationConfig.emailLinkBase,
      emailLogoURL: this.props.applicationConfig.emailLogoURL,
      emailPrivacyPolicyURL: this.props.applicationConfig.emailPrivacyPolicyURL,
      emailReturnPolicyURL: this.props.applicationConfig.emailReturnPolicyURL,
      emailContactUsURL: this.props.applicationConfig.emailContactUsURL,
      emailEMEAContactUsURL: this.props.applicationConfig.emailEMEAContactUsURL,
      loginURL: this.props.applicationConfig.loginURL,
      phoneNumberToDisplay: this.props.phoneNumberToDisplay,
      recipientEmail: this.state.recpEmails,
      scoURL: this.props.applicationConfig.scoURL,
      sendEmailURL: this.props.applicationConfig.sendEmailURL,
      yourName: this.state.yourName,
      yourEmail: !this.props.isEMEA ? ECOMMERCE_EMAIL : EMEA_ECOMMERCE_EMAIL,
      yourComments: this.state.comments,
    }

    // Stop propagation of the event to prevent the Modal from hiding itself. We will do it manually.
    event.stopPropagation()
    const fullYear = new Date().getFullYear()

    if (isFormValid) {
      this.successMsg = `${t('Email successfully sent to:')} ${this.state.recpEmails}`
      const {
        accountName,
        applicationConfig,
        billingAddress,
        billingAttn,
        billingCompany,
        consortiaID,
        costProps,
        createdOn,
        creditStatus,
        currency,
        currencyFormat,
        email,
        hasInvoicingEnabled,
        ipsUser,
        isLab,
        isSEWP,
        isShipComplete,
        isLoggedIn,
        name,
        orderDetails,
        orderStatus,
        orderSmartTracker,
        paymentType,
        phone,
        phoneNumberToDisplay,
        poNumber,
        poReleaseNumber,
        reportUsage,
        salesDocumentNumber,
        serialNumbers,
        shipments,
        shippingAddress,
        shippingAttn,
        shippingCompany,
        showEWR,
        soldTo,
        user,
        webReferenceNumber,
        isEMEA,
        getDEPInfo,
        isXD,
      } = this.props
      SendEmail({
        accountName,
        applicationConfig,
        billingAddress,
        billingAttn,
        billingCompany,
        consortiaID,
        configLabels,
        costProps,
        createdOn,
        creditStatus,
        currency,
        currencyFormat,
        email,
        fullYear,
        hasInvoicingEnabled,
        ipsUser,
        isSEWP,
        isShipComplete,
        isLoggedIn,
        name,
        orderDetails,
        orderStatus,
        orderSmartTracker,
        paymentType,
        phone,
        phoneNumberToDisplay,
        poNumber,
        poReleaseNumber,
        reportUsage,
        salesDocumentNumber,
        sendToOptions,
        serialNumbers,
        shipments,
        shippingAddress,
        shippingAttn,
        shippingCompany,
        showEWR,
        soldTo,
        user,
        webReferenceNumber,
        isEMEA,
        getDEPInfo,
        isXD,
      }).then(result => {
        if (result) {
          this.setState(this.initialState)
          this.props.onHide()
          this.props.showSuccessEmailMessage(this.successMsg)
        } else {
          this.setState({ emailFailure: true })
        }
      })
    }
  }

  render() {
    const sendersNameRequired = t("Sender's name is required.")
    const receipEmailRequired = t("Recipient's email address is required.")
    const requiredIndicator = t('Indicates required fields')
    const yourName = t('Your name')
    const recpEmail = t("Recipient's email")
    const yourComments = t('Your comments')
    const emailInfoText2 = t(
      'If you wish to send this email to more than one recipient, put a comma between separate email addresses in the '
    )
    const boxAbove = t('box above.')
    const emailFormat = t(' Example: recipient1@mywebsite.com, recipient2@mywebsite.com')
    const emailFailure = t('Email failed to send. If the problem persists, please call Customer Service.')

    return (
      <IWModal
        backdropClassName="iw-dialog iw-dialog-backdrop"
        showIf={this.props.showSTCModal}
        title={t('Send to colleague')}
        cancelBtnText={t('Cancel')}
        confirmBtnText={t('Send')}
        onHide={() => {
          this.props.onHide()
          this.setState(this.initialState)
        }}
        onConfirm={ event => this.submitSendToColleague(event)}
      >
        <div className="row send-to-colleague" data-private="true">
          <div className="column">
            <p>
              <strong className="form__required">*</strong> {requiredIndicator}
            </p>
            <label className="row row__gutter--tiny collapse">
              <div className="column small-12 medium-4 medium-text-right">
                <span className="form__label">
                  {yourName} <span className="form__required">*</span>
                </span>
              </div>
              <div className="column small-12 medium-8">
                <IWInputWithValidation
                  autoFocus
                  errorMessage={sendersNameRequired}
                  hideLabel
                  isValid={value => this.handleChange(value, NAME_FIELD)}
                  label={t('Your name')}
                  maxLength={500}
                  name="yourName"
                  required
                  type="text"
                />
              </div>
            </label>
            <label className="row row__gutter--tiny collapse">
              <div className="column small-12 medium-4 medium-text-right">
                <span className="form__label">
                  {recpEmail} <span className="form__required">*</span>
                </span>
              </div>
              <div className="column small-12 medium-8">
                <IWInputWithValidation
                  errorMessage={receipEmailRequired}
                  isValid={() => this.validField(this.state.recpEmails, EMAILS_FIELD)}
                  onChange={value => this.handleChange(value, EMAILS_FIELD)}
                  label={t('Recipients email')}
                  hideLabel
                  maxLength={500}
                  name="recpEmails"
                  required
                  type="email"
                />
              </div>
            </label>
            <label className="row row__gutter--tiny collapse">
              <div className="column small-12 medium-4 medium-text-right">
                <span className="form__label">{yourComments}</span>
              </div>
              <div className="column small-12 medium-8">
                <IWInput
                  hideLabel
                  label={t('Comments')}
                  maxLength={500}
                  name="comment"
                  onBlur={event => this.handleChange(event.target.value, COMMENT_FIELD)}
                  type="textArea"
                />
              </div>
            </label>
            <br />
            <p>
              {emailInfoText2}
              <strong>{recpEmail}</strong>&nbsp;
              {boxAbove}
              <em>{emailFormat}</em>
            </p>
            {this.state.emailFailure && (
              <p>
                <strong>{emailFailure}</strong>
              </p>
            )}
          </div>
        </div>
      </IWModal>
    )
  }
}

SendToColleagueModal.propTypes = {
  accountName: PropTypes.string.isRequired,
  applicationConfig: PropTypes.shape({
    emailLinkBase: PropTypes.string,
    emailLogoURL: PropTypes.string,
    emailPrivacyPolicyURL: PropTypes.string,
    emailReturnPolicyURL: PropTypes.string,
    emailContactUsURL: PropTypes.string,
    emailEMEAContactUsURL: PropTypes.string,
    loginURL: PropTypes.string,
    scoURL: PropTypes.string,
    sendEmailURL: PropTypes.string,
  }).isRequired,
  billingAddress: PropTypes.shape({
    // key value pairs
  }),
  billingAttn: PropTypes.string.isRequired,
  billingCompany: PropTypes.string.isRequired,
  costProps: PropTypes.shape({
    // key value pairs
  }),
  consortiaID: PropTypes.number.isRequired,
  createdOn: PropTypes.number.isRequired,
  creditStatus: PropTypes.string,
  currency: PropTypes.string.isRequired,
  currencyFormat: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  ipsUser: PropTypes.bool.isRequired,
  isLab: PropTypes.bool.isRequired,
  isSEWP: PropTypes.bool.isRequired,
  isShipComplete: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  orderDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
  orderStatus: PropTypes.string.isRequired,
  paymentType: PropTypes.string,
  phone: PropTypes.string.isRequired,
  phoneNumberToDisplay: PropTypes.string.isRequired,
  poNumber: PropTypes.string.isRequired,
  poReleaseNumber: PropTypes.string.isRequired,
  reportUsage: PropTypes.number,
  salesDocumentNumber: PropTypes.number.isRequired,
  serialNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
  shipments: PropTypes.arrayOf(PropTypes.object).isRequired,
  shippingAddress: PropTypes.shape({
    // key value pairs
  }),
  shippingAttn: PropTypes.string.isRequired,
  shippingCompany: PropTypes.string.isRequired,
  showEWR: PropTypes.bool.isRequired,
  showSTCModal: PropTypes.bool.isRequired,
  showSuccessEmailMessage: PropTypes.func.isRequired,
  soldTo: PropTypes.number.isRequired,
  user: PropTypes.shape({
    // key value pairs
  }).isRequired,
  webReferenceNumber: PropTypes.number.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isXD: PropTypes.bool.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
}

SendToColleagueModal.defaultProps = {
  creditStatus: null,
  paymentType: null,
}
