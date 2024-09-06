import React from 'react'
import PropTypes from 'prop-types'

export default function ErrorTableRow(props) {
  const totalNumberOfColumns = props.numberOfColumns + 1
  return (
    <tr className="iw-table__row">
      <td className="iw-table__column" colSpan={totalNumberOfColumns}>
        <div className="dashlet__table-error-msg text-right">
          <span className="ion-android-alert" />
          {props.errorMessage}
        </div>
      </td>
    </tr>
  )
}

ErrorTableRow.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  numberOfColumns: PropTypes.number.isRequired,
}
