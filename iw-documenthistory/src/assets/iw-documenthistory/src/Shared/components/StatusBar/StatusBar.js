import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import cn from 'classnames'


export const classNameStatusMap = {
  'Complete': 'complete',
  'In progress': 'in-progress',
  'In configuration lab': 'lab-config',
  'Lab complete': 'lab-complete',
  'On hold': 'on-hold',
  'Partially shipped': 'partial',
}

export default function StatusBar({ isLab, status }) {
  return isLab ? (
    <div>
      <p aria-hidden="false" className="show-for-print">
        {status}
      </p>
      <ul
        aria-hidden="true"
        className={cn(
          'hide-for-print order-status-bar order-status-bar--lab-order',
          `order-status-bar--${classNameStatusMap[status]}`
        )}
      >
        <li className="order-status order-status--on-hold">{t('On hold')}</li>
        <li className="order-status order-status--in-progress">{t('In progress')}</li>
        <li className="order-status order-status--lab-config">{t('In config lab')}</li>
        <li className="order-status order-status--lab-complete">{t('Lab complete')}</li>
        <li className="order-status order-status--partial">{t('Partially shipped')}</li>
        <li className="order-status order-status--complete">{t('Complete')}</li>
      </ul>
    </div>
  ) : (
    <div>
      <p aria-hidden="false" className="show-for-print">
        {status}
      </p>
      <ul
        aria-hidden="true"
        className={cn('hide-for-print order-status-bar', `order-status-bar--${classNameStatusMap[status]}`)}
      >
        <li className="order-status order-status--on-hold">{t('On hold')}</li>
        <li className="order-status order-status--in-progress">{t('In progress')}</li>
        <li className="order-status order-status--partial">{t('Partially shipped')}</li>
        <li className="order-status order-status--complete">{t('Complete')}</li>
      </ul>
    </div>
  )
}

StatusBar.propTypes = {
  isLab: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
}
