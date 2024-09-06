import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function generateSubHeader(type, text, icon) {
  return {
    rowComponent: HeaderRow,
    rowComponentProps: { text, type, icon },
  }
}
function HeaderRow({ numberOfColumns, text, type, icon }) {
  return (
    <tbody className="iw-table__tbody">
      <tr className="iw-table__row">
        <th className={`dashlet__table-subheading subheading-${type}`} colSpan={numberOfColumns + 1}>
          {icon && icon === 'alert' && <span className="ion-android-alert subheading__icon" />}
          <span>{t(text)}</span>
        </th>
      </tr>
    </tbody>
  )
}

HeaderRow.propTypes = {
  numberOfColumns: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['critical', 'warning', 'safe']).isRequired,
}
