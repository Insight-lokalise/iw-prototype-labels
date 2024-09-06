import React from 'react'
import PropTypes from 'prop-types'
import { IWButton } from '../../../../iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function ConfirmationTableRow(props) {
  const totalNumberOfColumns = props.numberOfColumns + 1

  return (
    <tr className="iw-table__row">
      <td className="iw-table__column" colSpan={totalNumberOfColumns}>
        <div className="dashlet__table-confirm-msg text-right">
          {t('Are you sure?')}
          <IWButton className="hollow small no-margin-bot dashlet__table-button" onClick={props.onCancel}>
            {t('Cancel')}
          </IWButton>
          <IWButton className="small no-margin-bot dashlet__table-button" onClick={props.onConfirm} disabled={props.isRequisitionUpdating}>
            {t('Yes')}
          </IWButton>
        </div>
      </td>
    </tr>
  )
}

ConfirmationTableRow.propTypes = {
  numberOfColumns: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isRequisitionUpdating: PropTypes.bool.isRequired
}
