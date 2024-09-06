import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

/**
 * the head of the responsive table. Renders non collapsed columns
 */
export default function IWResponsiveTableHead(props) {
  return (
    <thead className="iw-table__head">
      <tr className="iw-table__row">
        <td className="iw-table__column iw-table__column--expand-icon" ref={props.tableColRef('IWRTExpandable')} />
        {props.visibleTableColumns.map(column => (
          <th
            key={column.reference}
            ref={props.tableColRef(column.reference)}
            className={cn('iw-table__heading', column.className)}
          >
            {column.name}
          </th>
        ))}
      </tr>
    </thead>
  )
}

IWResponsiveTableHead.propTypes = {
  tableColRef: PropTypes.func.isRequired,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
}
