import React, { Component } from 'react'
import { getConfigLabels, t } from '@insight/toolkit-utils/lib/labels'

import { IWAnchor, IWImage, IWModal} from './../../iw-components'
import msgBox from './../../iw-components/iw-messageBox'
import { getObject } from './../../models/Email'
import PrintPreviewModal from './../../../app/ShoppingCart/components/printPreview/PrintPreviewModal'
import { validateEmail, validateEmails } from './../../models/Security/validation'
import { SendToColleague } from './SendToColleague'
import {enrollmentInfoToUpdate} from "../cart/helpers";
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { ECOMMERCE_EMAIL, EMEA_ECOMMERCE_EMAIL } from './constants'

export class OrderUtilitiesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      configLabels: {},
      showSendToColleagueModal: false,
    };
  }

  componentDidMount(){
    const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")
    const country = localeValue.split('_')[1];

    getConfigLabels(country)
      .then((labels) => this.setState({ configLabels: labels }))
      .catch(() => this.setState({ configLabels: {} }))
  }

  setSendToColleagueFocus() {
    this.sendToColleagueYourName.focus();
  }

  clearErrorMsgs() {
    this.sendToColleagueYourNameMsg.classList.add("hide");
    this.sendToColleagueRecipientEmailMsg.classList.add("hide");
  }

  exportCartAsXLS() {
    const {
      hasEnrollmentInfoToUpdate,
      optOutPartners,
      optInPartners,
    } = enrollmentInfoToUpdate(this.props.enrollmentInfo);
    hasEnrollmentInfoToUpdate
      ? this.props
          .submitEnrollmentValues({
            enrollments: optInPartners,
            removedIds: optOutPartners,
          })
          .then(() => {
            this.props.exportCartAsXLS();
          })
      : this.props.exportCartAsXLS();
  }

  hideSendToColleagueModal() {
        this.setState({
            showSendToColleagueModal: false,
        })
    }

  openPrintView(e, isOpen) {
    const {
      hasEnrollmentInfoToUpdate,
      optOutPartners,
      optInPartners,
    } = enrollmentInfoToUpdate(this.props.enrollmentInfo);
    hasEnrollmentInfoToUpdate
      ? this.props
        .submitEnrollmentValues({
          enrollments: optInPartners,
          removedIds: optOutPartners,
        })
        .then(() => {
          this.props.togglePrintPreview(isOpen);
        })
      : this.props.togglePrintPreview(isOpen);
  }

  showSendToColleagueModal() {
    const {
      hasEnrollmentInfoToUpdate,
      optOutPartners,
      optInPartners,
    } = enrollmentInfoToUpdate(this.props.enrollmentInfo);
    hasEnrollmentInfoToUpdate
      ? this.props
        .submitEnrollmentValues({
          enrollments: optInPartners,
          removedIds: optOutPartners,
        })
        .then(() => {
          this.setState({
            showSendToColleagueModal: true,
          });
        })
      : this.setState({
        showSendToColleagueModal: true,
      });
  }

  submitSendToColleague(event) {
    var sendToOptions = {
      yourName: this.sendToColleagueYourName.value,
      recipientEmail: this.sendToColleagueRecipientEmail.value,
      yourComments: this.sendToColleagueYourComments.value,
      phoneNumberToDisplay: this.props.phoneNumberToDisplay,
      emailLinkBase: this.props.applicationConfig.emailLinkBase,
      emailLogoURL: this.props.applicationConfig.emailLogoURL,
      emailPrivacyPolicyURL: this.props.applicationConfig.emailPrivacyPolicyURL,
      emailReturnPolicyURL: this.props.applicationConfig.emailReturnPolicyURL,
      emailContactUsURL: this.props.applicationConfig.emailContactUsURL,
      emailEMEAContactUsURL: this.props.applicationConfig.emailEMEAContactUsURL,
      loginURL: this.props.applicationConfig.loginURL,
      sendEmailURL: this.props.applicationConfig.sendEmailURL,
    };

    var invalidForm = false;

    if (!this.sendToColleagueYourName.value) {
      this.sendToColleagueYourNameMsg.classList.remove("hide");
      invalidForm = true;
    }

    // Stop propagation of the event to prevent the Modal from hiding itself. We will do it manually.
    event.stopPropagation();

    var stc = this;

    if (!invalidForm) {
      this.successMsg = t('Email successfully sent to colleague(s) ') + getObject(this, 'sendToColleagueRecipientEmail.value', '');
      const { configLabels } = this.state
      const {
          user,
          consortiaID,
          currencyFormat,
          shoppingRequest,
          showOrderReviewDetails,
          showOrderReceiptDetails,
          showProductImages,
          headerLevelSmartTrackers,
          cart,
          transportsToDetermine,
          numberOfItemsInCart,
          isEMEA,
          ipsUser,
          isNavy,
          navySTName,
          hasAdditionalOrderInformation,
          hasLabConfigurationNotes,
          hasInvoiceNotes,
          hasAdditionalOrderNotes,
          hasFileUpload,
          hasUserPreferences,
          creditCardMessage,
      } = this.props;
      sendToOptions.yourEmail = !isEMEA ? ECOMMERCE_EMAIL : EMEA_ECOMMERCE_EMAIL
      SendToColleague({
        cart,
        configLabels,
        consortiaID,
        creditCardMessage,
        currencyFormat,
        hasAdditionalOrderInformation,
        hasLabConfigurationNotes,
        hasInvoiceNotes,
        hasAdditionalOrderNotes,
        hasFileUpload,
        hasUserPreferences,
        headerLevelSmartTrackers,
        isEMEA,
        ipsUser,
        isNavy,
        sendToOptions,
        shoppingRequest,
        showOrderReviewDetails,
        showOrderReceiptDetails,
        showProductImages,
        transportsToDetermine,
        numberOfItemsInCart,
        navySTName,
        user,
      }).then((result) => {
        if (
          result.statusText === "OK" ||
          result.statusText === "" ||
          result.statusText === "200"
        ) {
          stc.hideSendToColleagueModal();
          msgBox.addMsg("shopping-cart", {
            msgId: "sendToColleagueResponse",
            className: "hide-for-print",
            text: t(this.successMsg),
            severity: "success",
          });
        } else {
          stc.sendToColleagueSendMsg.classList.remove("hide");
          stc.sendToColleagueSendMsgText.innerHTML = result.statusText;
        }
      });
    }
  }

  render() {
        const exportAsfile = t('Export as a file')
        const sendToColleague = t('Send to a colleague')
        const print = t('Print')
        const sendersNameRequired = t("Sender's name is required.")
        const sendersEmailRequired = t("Sender's email address is required.")
        const receipEmailRequired = t("Recipient's email address is required.")
        const requiredIndicator = t('Indicates required fields')
        const yourName = t('Your name')
        const recpEmail = t("Recipient's email")
        const yourComments = t('Your comments')
        const emailInfoText2 = t('If you wish to send this email to more than one recipient, put a comma between separate email addresses in the ')
        const boxAbove = t(' box above.')
        const emailFormat = t(' Example: recipient1@mywebsite.com, recipient2@mywebsite.com')
        const emailFailure = t('Email failed to send. If the problem persists, please call Customer Service.')
        
        return (
            <div className="columns shopping-cart__share text-right">
                { !this.props.hideExportAsFile &&
                    <IWAnchor className="ion-ios-download-outline shopping-cart__export" href="#" onClick={this.exportCartAsXLS.bind(this)}>
                        <span className="hide-for-small-only">{exportAsfile}</span>
                    </IWAnchor>
                }
                {!this.props.hideSendToColleague && <IWAnchor className="ion-paper-airplane shopping-cart__send" href="#" onClick={this.showSendToColleagueModal.bind(this)}>
                    <span className="hide-for-small-only">{sendToColleague}</span>
                </IWAnchor>}
                {!this.props.hidePrintFeature && <IWAnchor className="ion-ios-printer-outline shopping-cart__print" href="#"
                    onClick={this.openPrintView.bind(this, true)}>
                    <span className="hide-for-small-only">{print}</span>
                </IWAnchor>}
                { this.props.isPrintPreviewOpen
                    ? <PrintPreviewModal
                        showPrintPreview={this.props.isPrintPreviewOpen}
                        pathname={this.props.pathname}
                        onHide={this.openPrintView.bind(this, false)}/>
                    : null }

                <IWModal
                    backdropClassName='iw-dialog iw-dialog-backdrop'
                    showIf={this.state.showSendToColleagueModal}
                    title={t('Send to colleague')}
                    cancelBtnText={t('Cancel')}
                    confrimBtnText={t('Send')}
                    onShow={this.setSendToColleagueFocus.bind(this)}
                    onHide={this.hideSendToColleagueModal.bind(this)}
                    onConfirm={this.submitSendToColleague.bind(this)}
                >
                    <div className="row send-to-colleague">
                        <div className="column">
                            <p><strong className="form__required">*</strong> {requiredIndicator}</p>
                            <label className="row row__gutter--tiny collapse">
                                <div className="column small-12 medium-4 medium-text-right">
                                    <span className="form__label">{yourName} <span className="form__required">*</span></span>
                                </div>
                                <div className="column small-12 medium-8">
                                    <input ref={(c) => this.sendToColleagueYourName = c }
                                        onKeyUp={this.clearErrorMsgs.bind(this)}
                                        type="text" size="50" maxLength="500" className="form__field"
                                    />
                                    <div ref={(c) => this.sendToColleagueYourNameMsg = c }
                                         className="hide form__field-msg form__field-msg--error">
                                        {sendersNameRequired}
                                    </div>
                                </div>
                            </label>
                            <label className="row row__gutter--tiny collapse">
                                <div className="column small-12 medium-4 medium-text-right">
                                    <span className="form__label">{recpEmail} <span className="form__required">*</span></span>
                                </div>
                                <div className="column small-12 medium-8">
                                    <input ref={(c) => this.sendToColleagueRecipientEmail = c }
                                        onKeyUp={this.clearErrorMsgs.bind(this)}
                                        type="text" size="50" maxLength="500" className="form__field"
                                    />
                                    <div ref={(c) => this.sendToColleagueRecipientEmailMsg = c }
                                         className="hide form__field-msg form__field-msg--error">
                                        {receipEmailRequired}
                                    </div>
                                </div>
                            </label>
                            <label className="row row__gutter--tiny collapse">
                                <div className="column small-12 medium-4 medium-text-right">
                                    <span className="form__label">{yourComments}</span>
                                </div>
                                <div className="column small-12 medium-8">
                                    <textarea ref={(c) => this.sendToColleagueYourComments = c }
                                        className="form__field"
                                    />
                                </div>
                            </label>
                            <br />
                            <p>{emailInfoText2}<strong>{recpEmail}</strong>{boxAbove}
                                <em>{emailFormat}</em>
                            </p>
                            <p ref={(c) => this.sendToColleagueSendMsg = c }
                                 className="hide color--red">
                                <strong>{emailFailure}</strong>
                                <span ref={(c) => this.sendToColleagueSendMsgText = c }/>
                            </p>
                        </div>
                    </div>
                </IWModal>
            </div>
        )
    }
}
