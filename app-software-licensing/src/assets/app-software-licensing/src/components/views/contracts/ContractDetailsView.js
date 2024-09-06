import React, { Fragment }  from 'react'
import { Flag, Date } from '@insight/toolkit-react'
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils';
import { getAnniversaryMonth } from '../../../lib/dateHelpers'
import { effectiveDate, expirationDate, enrollmentCountry, anniversaryMonth, months, expired, notAvailable } from '../../../constants'

export default function ContractDetailsView({agreement}) {
  return (
    <div className="o-grid__item  u-1/1 u-1/1@tablet u-3/4@desktop c-software-license__contract-details">
      <div className="o-grid o-grid--gutters c-software-license__padding-top">
        <div className="o-grid__item  u-1/1 u-1/4@tablet c-software-license__padding-bot">
          <div className="o-grid">
            <div className="o-grid__item u-1/1@tablet u-hide@desktop c-software-license__contract-details--header">{t(effectiveDate)}</div>
            <div className="o-grid__item o-grid__item--shrink"><Date date={agreement.startDate} /></div>
          </div>
        </div>
        <div className="o-grid__item  u-1/1 u-1/4@tablet c-software-license__padding-bot">
          <div className="o-grid">
            <div className="o-grid__item u-1/1@tablet u-hide@desktop  c-software-license__contract-details--header">{t(expirationDate)}</div>
            <span><Date date={agreement.endDate} /></span>
          </div>
        </div>
        <div className="o-grid__item  u-1/1 u-1/4@tablet c-software-license__padding-bot">
          <div className="o-grid c-software-license__time">
            <div className="o-grid__item u-1/1@tablet u-hide@desktop  c-software-license__contract-details--header">{t(anniversaryMonth)}</div>
            <span>{agreement.anniversaryDate ? getAnniversaryMonth(agreement.anniversaryDate) : t(notAvailable)}</span>
          </div>
        </div>
        <div className="o-grid__item  u-1/1 u-1/4@tablet c-software-license__padding-bot">
          <div className="o-grid">
            <div className="o-grid__item u-1/1@tablet u-hide@desktop  c-software-license__contract-details--header">{t(enrollmentCountry)}</div>
            <span className='c-software-license__flag'>{agreement.enrollmentCountry && <Flag country={(agreement.enrollmentCountry.toLowerCase())} />}</span>
          </div>
        </div>        
      </div>
    </div>
  )
}
ContractDetailsView.propTypes = {
  agreement: PropTypes.shape({
    endDate: PropTypes.number,
    enrollmentCountry: PropTypes.string,
    remainingMonths: PropTypes.number,
    startDate: PropTypes.number,
  }).isRequired
}
