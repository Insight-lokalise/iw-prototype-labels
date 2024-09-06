import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Currency } from '@insight/toolkit-react'

import transformRequisitonDashletData from '../RequisitionTableRow/requisitionHelpers'
import ApproverActionsDropdown from './ApproverActionsDropdown'
import { IWAnchor } from '../../../../iw-components'

export default function transformApproverData(approverData) {
  return transformRequisitonDashletData(approverData, createApproverRowData)
}

function createApproverRowData(requisition) {
  const numOfDaysText = `${requisition.numOfDays === 1 ? 'day' : 'days'}`
  return {
    referenceNumber: requisition.sessionWebGroup ? (
      <IWAnchor href={`ar/requisitionOrder?stNum=${requisition.referenceNumber}`}>
        {requisition.referenceNumber}
      </IWAnchor>
    ) : (
      requisition.referenceNumber
    ),
    requestor: requisition.requestor,
    creationDate: (
      <div>
        <span>{requisition.createdDate}</span>
        <span className="no-wrap">{` (${requisition.numOfDays} ${t(numOfDaysText)})`}</span>
      </div>
    ),
    daysInQueue: `${requisition.daysInQueue}`,
    account: `${requisition.accountNumber} - ${requisition.accountName}`,
    total: <Currency className="no-wrap" value={Number(requisition.total)} currencyCode={requisition.currencyCode} />,
    actions: <ApproverActionsDropdown requisition={requisition} />,
  }
}
