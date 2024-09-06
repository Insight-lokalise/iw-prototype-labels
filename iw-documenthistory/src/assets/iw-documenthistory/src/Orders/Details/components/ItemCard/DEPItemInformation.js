import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'

export default function DEPItemInformation({ materialId, customerId, isLoggedIn }) {
  return (
    <div className="line-item-info">
      <h3 className="line-item-info__heading">{t('Device Enrollment Program')}</h3>
      <div>
        <div>
          <div className="row collapse expanded">
            <div className="columns small-6 large-4">
              <span className="line-item-info__label">{t('Insight Part #')}:</span>
            </div>
            <div className="columns small-6 large-4">
              <span className="line-item-info__value">{materialId}</span>
            </div>
          </div>
          {isLoggedIn && (
            <div className="row collapse expanded">
              <div className="columns small-6 large-4">
                <span className="line-item-info__label">{t('DEP Organization ID #')}:</span>
              </div>
              <div className="columns small-6 large-4">
                <span className="line-item-info__value">{customerId}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

DEPItemInformation.propTypes = {
  materialId: PropTypes.string.isRequired,
  customerId: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
