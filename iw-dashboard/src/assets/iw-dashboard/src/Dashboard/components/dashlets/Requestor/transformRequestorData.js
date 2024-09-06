import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Currency } from '@insight/toolkit-react'

import transformRequisitonDashletData from '../RequisitionTableRow/requisitionHelpers'
import ApprovalPathHierarchy from './ApprovalPathHierarchy'
import { IWAnchor, IWButton, IWOverlay } from '../../../../iw-components'

export default function transformRequestorData(requestorData) {
  return transformRequisitonDashletData(requestorData, createRequestorRowData)
}

function createRequestorRowData(requisition) {
  const numOfDaysText = `${requisition.numOfDays === 1 ? 'day' : 'days'}`
  const showApprovalPathHierarchy =
    requisition.grouped ||
    requisition.approvalPathHierarchy.length > 1 ||
    (requisition.approvalPathHierarchy.length === 1 &&
      requisition.approvalPathHierarchy[0].approvalDetailList &&
      requisition.approvalPathHierarchy[0].approvalDetailList.length > 1)

  const approverContents = (
    <div>
      {requisition.grouped ? `${t('Grouped')} -` : requisition.nextApprover}
      {showApprovalPathHierarchy && (
        <IWOverlay
          overlayBody={<ApprovalPathHierarchy approvalPathHierarchy={requisition.approvalPathHierarchy} />}
          title={t('Approvers')}
          className="dashlet__table-overlay"
          bodyClassName="dashlet__table-overlay-body"
        >
          &nbsp;{`(${t('Total')}: ${requisition.numOfApprovers} ${t('approvers')})`}
        </IWOverlay>
      )}
    </div>
  )

  return {
    referenceNumber: requisition.sessionWebGroup ? (
      <IWAnchor href={`ar/requisitionOrder?stNum=${requisition.referenceNumber}`}>
        {requisition.referenceNumber}
      </IWAnchor>
    ) : (
      requisition.referenceNumber
    ),
    approver: approverContents,
    creationDate: (
      <div>
        <span>{requisition.createdDate}</span>
        <span className="no-wrap">{` (${requisition.numOfDays} ${t(numOfDaysText)})`}</span>
      </div>
    ),
    daysWaitingForApproval: requisition.daysInQueue,
    account: `${requisition.accountNumber} - ${requisition.accountName}`,
    total: <Currency className="no-wrap" value={Number(requisition.total)} currencyCode={requisition.currencyCode} />,
    actions: <RequestorCancelButton allowCancel={requisition.cancelRequisition} />,
  }
}

function RequestorCancelButton(props) {
  return props.allowCancel ? (
    <IWButton onClick={e => props.handleAction(e.target)} className="hollow small dashlet__btn no-margin-bot" value={2}>
      {t('Cancel')}
    </IWButton>
  ) : (
    <span>-</span>
  )
}

RequestorCancelButton.propTypes = {
  allowCancel: PropTypes.bool.isRequired,
  // implicit
  handleAction: PropTypes.func,
}

RequestorCancelButton.defaultProps = {
  handleAction: () => null,
}
