import React from 'react'
import PropTypes from 'prop-types'
import { IWAnchor } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
import Icon from "@insight/toolkit-react/lib/Icon/Icon";

import { convertMillsecToDate } from '../../../Search/constants/Date'

export default function HostedLicensing({ emailMessage, isLoggedIn, isShipComplete, reportUsage, showEmailMessage, isXD }) {
  const isSplaOrCitrix = !!reportUsage
  const date = isSplaOrCitrix && convertMillsecToDate(reportUsage, 'MMMM-YYYY')

  return (
    <>
      {!isLoggedIn && (
        <div className="hosted-licensing__message">
          <Icon
			      aria-hidden="true"
			      className={'hosted-licensing__icon c-icon--info'}
			      icon="alert"
		      />
          <span>
            <IWAnchor className="orders__link hide-for-print" href="/insightweb/login">
              {t('Log in ')}
            </IWAnchor>
            {t('to your insight.com account to view complete order information.')}
          </span>
        </div>
      )}
      {isSplaOrCitrix && (
        <p className="hosted-licensing__message">
          {t('This order placed for reporting date')}: <strong>{date}</strong>
        </p>
      )}
      {isShipComplete && (
        <div className="hosted-licensing__message">
          <Icon
			      aria-hidden="true"
			      className={'hosted-licensing__icon c-icon--info'}
			      icon="alert"
		      />
          <span>
            {t('This order is flagged to ship once all items become available.')}
          </span>
        </div>
      )}
      {showEmailMessage && (
        <div className="hosted-licensing__message">
          <Icon
            aria-hidden="true"
            className={'hosted-licensing__icon c-icon--success'}
            icon="checkmark-circled"
          />
          <span>{emailMessage}</span>
        </div>
      )}
      {isXD && (
        <div className="hosted-licensing__message">
          <Icon
			      aria-hidden="true"
			      className={'hosted-licensing__icon c-icon--warning'}
			      icon="warning"
		      />
          <span>
            {t(`There has been an issue calculating shipping costs for this order. Either the freight cost is too large to calculate automatically or the address provided has returned an error. All totals are therefore showing as 'Estimated', as this price does not include shipping costs.`)}
          </span>
        </div>
      )}
    </>
  )
}

HostedLicensing.propTypes = {
  emailMessage: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  isShipComplete: PropTypes.bool,
  reportUsage: PropTypes.number,
  showEmailMessage: PropTypes.bool,
  isXD: PropTypes.bool,
}

HostedLicensing.defaultProps = {
  emailMessage: '',
  isShipComplete: false,
  reportUsage: 0,
  showEmailMessage: false,
}
