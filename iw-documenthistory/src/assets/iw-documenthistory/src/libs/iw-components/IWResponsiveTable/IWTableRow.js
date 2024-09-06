import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWAnchor } from '../'

/**
 * basic table rows that show table data fed into responsive table
 */
export default function IWTableRow(props) {
  const { isExpandable, isExpanded, rowData, toggleExpand, visibleTableColumns } = props
  // TODO: figure out way to meaure this piece as part of breakpoint measurements without rendering
  // afterwards change 'invisible' to 'hide'
  const expandableIcon = (
    <IWAnchor className={cn('iw-table__icon', { invisible: !isExpandable })} onClick={toggleExpand}>
      {isExpanded ? (
        <span className="iw-table__icon-ion ion-chevron-down" />
      ) : (
        <span className="iw-table__icon-ion ion-chevron-right" />
      )}
    </IWAnchor>
  )

  return (
    <tr className="iw-table__row">
      <td className="iw-table__column iw-table__column--expand-icon">{expandableIcon}</td>
      {visibleTableColumns.map(column => (
        <td className={cn('iw-table__column', column.className)} key={column.reference}>
          {rowData[column.reference]}
        </td>
      ))}
    </tr>
  )
}

IWTableRow.propTypes = {
  isExpandable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  rowData: PropTypes.object.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
}

IWTableRow.defaultProps = {
  isExpandable: false,
  isExpanded: false,
}
