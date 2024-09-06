import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { msgBox } from '../../../../libs/iw-components'
import {
  IWMessage,
  IWMessageBox,
} from '../../../../libs/iw-components/iw-messageBox'
import ReportUsage from '../../../../libs/businessContainerApps/reportUsage/ReportUsage'

export function ReviewReceiptMessageHeaderView(props) {
  msgBox.removeMsg('shopping-cart', 'internationalFreightFees')
  msgBox.removeMsg('shopping-cart', 'invalidCESParts')
  msgBox.removeMsg('shopping-cart', 'sendToColleagueResponse')
  msgBox.removeMsg('shopping-cart', 'invalidMaterial')
  const intFreightMsg = `International Freight fees will apply to this order. Totals are therefore showing as 'Estimated' and may be adjusted upon order receipt.`
  return (
    <div>
      {!props.isReceipt && props.p65Warnings.length > 0 && (
        <div className="row expanded is-collapse-child">
          <div className="column SBP__messages">
            {props.p65Warnings.map((warning) => (
              <div className="SBP__p65-warnings">
                <span className="ion-android-warning"></span>{' '}
                <span dangerouslySetInnerHTML={{ __html: warning }}></span>
              </div>
            ))}
          </div>
        </div>
      )}
      {props.hasInternationalCarrier && (
        <div className="row expanded is-collapse-child">
          <div className="column SBP__messages">
            <div>
              <IWMessage
                className="expanded"
                text={t(intFreightMsg)}
                severity="info"
              />
            </div>
          </div>
        </div>
      )}
      <IWMessageBox
        boxId="shopping-cart"
        Content={(props) => (
          <div className="row expanded is-collapse-child">
            <div className="column SBP__messages">
              <div>
                {props.messages.map((msg) => (
                  <IWMessage className="expanded" key={msg.text} {...msg} />
                )) || null}
              </div>
            </div>
          </div>
        )}
      />
      <ReportUsage />
    </div>
  )
}

ReviewReceiptMessageHeaderView.propTypes = {
  hasInternationalCarrier: PropTypes.bool.isRequired,
  isReceipt: PropTypes.bool.isRequired,
}
