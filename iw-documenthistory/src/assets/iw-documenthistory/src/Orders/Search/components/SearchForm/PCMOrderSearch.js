import React from 'react'
import PropTypes from 'prop-types'
import { IWAnchor } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

export function PCMOrderSearch() {
  const PCMOrders = 'https://bd.pcm.com/'
  const OpstrackOrders = 'https://www.opstrack.com/'
  return (
    <div className="text-right">
      <IWAnchor className="orders__link order__link--block" href={PCMOrders} target="_blank">
        <span className="orders__link-text">{t('Business Direct order status')}</span>
        <span className="orders__ion-icon orders__ion-icon--right ion-share" />
      </IWAnchor>
      <br />
      <IWAnchor className="orders__link order__link--block" href={OpstrackOrders} target="_blank">
        <span className="orders__link-text">{t('Opstrack order status')}</span>
        <span className="orders__ion-icon orders__ion-icon--right ion-share" />
      </IWAnchor>
    </div>
  )
}
