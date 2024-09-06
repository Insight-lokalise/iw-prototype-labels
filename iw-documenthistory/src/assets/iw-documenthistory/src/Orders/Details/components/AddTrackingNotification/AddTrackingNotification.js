import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IWAnchor, IWInputWithValidation, IWModalLink } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

import { addTrackingNotifications, validateEmail } from '../../../../models/OrderDetails/OrderDetails'

export default class AddTrackingNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emails: [props.email],
      showConfirmation: false,
    }
  }

  handleEmailChange(e, idx){
    const newEmailsList = this.state.emails.map((email, emailIdx) => {
      if (idx !== emailIdx) return email
      return e.target.value
    })
    this.setState({ emails: newEmailsList })
  }

  handleAddEmail = () => {
    this.setState(prevState => ({ emails: prevState.emails.concat(['']) }))
  }

  handleSubmit = () => {
    const body = {
      emailId: this.state.emails.join(','),
      orderNo: `${this.props.orderNumber}`,
      trackingInfo: this.props.serialNumbers,
    }
    addTrackingNotifications(body)
      .then(() => {
        this.setState({ showConfirmation: true })
      })
      .catch(e => {
        // TODO: Ask if a message should be shown to the user.
        console.error('Unable to add tracking notification.', e)
      })
  }

  areEmailsValid = () => {
    return this.state.emails.every(email => validateEmail(email))
  }

  emptyInput() {
    this.setState({ emails: [''] })
  }

  handleDelete = (idx) => {
    if (this.state.emails.length > 1) {
      const newEmailsList = this.state.emails.reduce((acc, email, emailIdx) => {
        if (idx === emailIdx) {
          return acc
        }
        acc.push(email)
        return acc
      }, [])
      this.setState({ emails: newEmailsList })
    } else {
      this.emptyInput()
    }
  }

  render() {
    return (
      <div>
        <IWModalLink
          className="orders__link"
          confirmBtnText="Save"
          modalSize="small"
          modalTitle="Tracking notifications"
          onConfirm={this.handleSubmit}
          isValid={this.areEmailsValid}
          linkMarkup={
            <span className="orders__link order__link--block js-gtm-orders__add-additional-tracking">
              <span className="orders__link-text">{t('Add tracking notifications')}</span>
              <span className="orders__ion-icon orders__ion-icon--right ion-paper-airplane" />
            </span>
          }
          modalBody={
            <div className="row">
              <div className="columns">
                <p>
                  {t(
                    'To receive tracking notifications and status reports for your order, please enter one or more email addresses below. Please note that emails from the carrier are the most reliable tracking method for shipments.'
                  )}
                </p>
                <label className="form__label" data-private="true">
                  <span className="form__label-text">{t('Add notification email')}</span>
                  {this.state.emails.map((email, idx) => (
                    /**
                     * Please do not add a key to this list.
                     * email changes every time the user types a character, and
                     * adding Key with map's index is react's default behaviour.
                     */
                    <div className="row collapse align-middle" key={idx}>
                      <div className="columns expand">
                        <IWInputWithValidation
                          value={email}
                          errorMessage={t('Please enter a valid Notification email.')}
                          isValid={() => validateEmail(email)}
                          hideLabel
                          name={email}
                          onChange={e => this.handleEmailChange(e, idx)}
                          type={'email'}
                        />
                      </div>
                      <span
                        onClick={() => this.handleDelete(idx)}
                        className="columns shrink form__label-icon ion-close"
                      />
                    </div>
                  ))}
                </label>
                <IWAnchor className="orders__link" onClick={this.handleAddEmail}>
                  <span className="orders__ion-icon orders__ion-icon--left ion-ios-plus-outline" />
                  <span className="orders__link-text">{t('Add additional notification email')}</span>
                </IWAnchor>
              </div>
            </div>
          }
        />
        {this.state.showConfirmation && (
          <div className="tracking-notification-confirmation">
            <span className="tracking-notification-confirmation__icon ion-checkmark-circled" />
            <span className="tracking-notification-confirmation__text">{t('Tracking notifications added')}</span>
          </div>
        )}
      </div>
    )
  }
}

AddTrackingNotification.propTypes = {
  email: PropTypes.string.isRequired,
  orderNumber: PropTypes.number.isRequired,
  serialNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
}
