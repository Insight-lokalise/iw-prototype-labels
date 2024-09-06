import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function ApprovalPathHierarchy(props) {
  const { approvalPathHierarchy } = props
  return (
    <aside className="approval-tracker">
      {approvalPathHierarchy.length === 1 ? (
        <ApproversList approvalDetailList={approvalPathHierarchy[0].approvalDetailList} />
      ) : (
        approvalPathHierarchy.map(
          ({ approvalDetailList, approvalPathGroup, groupedApprovers, groupStatusId, sequenceId }) => (
            <ApprovalTier
              key={sequenceId}
              approvalDetailList={approvalDetailList}
              approvalPathGroup={approvalPathGroup}
              groupedApprovers={groupedApprovers}
              statusId={groupStatusId}
            />
          )
        )
      )}
    </aside>
  )
}

const approvalDetailListItem = PropTypes.shape({
  approverName: PropTypes.string.isRequired,
  statusId: PropTypes.number.isRequired,
})

ApprovalPathHierarchy.propTypes = {
  approvalPathHierarchy: PropTypes.arrayOf(
    PropTypes.shape({
      approvalDetailList: PropTypes.arrayOf(approvalDetailListItem).isRequired,
      approvalPathGroup: PropTypes.string.isRequired,
      groupedApprovers: PropTypes.bool.isRequired,
      groupStatusId: PropTypes.number.isRequired,
      sequenceId: PropTypes.number.isRequired,
    })
  ).isRequired,
}

function ApproversList(props) {
  return (
    <ol className="approval-tracker__list">
      {props.approvalDetailList.map(approver => (
        <li
          className={cn(
            'approval-tracker__list-item row collapse',
            approver.statusId === 1 && 'approval-tracker__list-item--solid'
          )}
          key={JSON.stringify(approver)}
        >
          <ApprovalStatusIcon statusId={approver.statusId} />
          <span className="approval-tracker__name columns">{`${approver.approverName}`}</span>
        </li>
      ))}
    </ol>
  )
}

ApproversList.propTypes = {
  approvalDetailList: PropTypes.arrayOf(approvalDetailListItem).isRequired,
}

function ApprovalTier(props) {
  const groupedApproversText = '(grouped approvers)'
  return (
    <ol className={cn('approval-tracker__list', props.statusId === 1 && 'approval-tracker__list--solid')}>
      <li className="approval-tracker__list-item row collapse">
        <ApprovalStatusIcon statusId={props.statusId} />
        <div className="columns">
          <h3 className="approval-tracker__path-group">
            {props.approvalPathGroup}
            {props.groupedApprovers && (
              <span className="approval-tracker__grouped-approvers"> {t(groupedApproversText)}</span>
            )}
          </h3>
          <ApproversList approvalDetailList={props.approvalDetailList} />
        </div>
      </li>
    </ol>
  )
}

ApprovalTier.propTypes = {
  approvalDetailList: PropTypes.arrayOf(approvalDetailListItem).isRequired,
  approvalPathGroup: PropTypes.string.isRequired,
  groupedApprovers: PropTypes.bool.isRequired,
  statusId: PropTypes.number.isRequired,
}

function ApprovalStatusIcon(props) {
  switch (props.statusId) {
    case 1:
      return <span className="ion-checkmark-circled approval-tracker__icon columns shrink" />
    case 4:
      return (
        <span className="ion-android-radio-button-off approval-tracker__icon approval-tracker__icon--gray columns shrink" />
      )
    case 5:
      return <span className="ion-android-radio-button-off approval-tracker__icon columns shrink" />
    case 6:
      return (
        <span className="ion-android-radio-button-on approval-tracker__icon approval-tracker__icon--gray columns shrink" />
      )
    default:
      console.warn(`${props.statusId} not recognized`)
      return null
  }
}

ApprovalStatusIcon.propTypes = {
  // status: 1(approved by entire approval tier) /2 (canceled) / 3 (denied) /
  // 4 (inactive) / 5 (active) / 6 (under review)
  statusId: PropTypes.oneOf([1, 4, 5, 6]).isRequired,
}
