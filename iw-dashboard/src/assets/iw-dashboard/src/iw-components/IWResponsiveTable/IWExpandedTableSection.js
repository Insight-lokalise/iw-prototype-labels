import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function IWExpandedTableSection(props) {
  const { hiddenTableColumns, isExpanded, numberOfColumns, rowData } = props
  const totalNumberOfColumns = numberOfColumns + 1
  return (
    <tr className={cn('iw-table__row', { hide: !isExpanded || hiddenTableColumns.length === 0 })}>
      <td className="iw-table__column" colSpan={totalNumberOfColumns}>
        <table className="iw-table-nested">
          <tbody>
            {hiddenTableColumns.map(data => (
              <tr key={data.reference} className="iw-table-nested__row">
                <td className="iw-table-nested__column iw-table-nested__heading">{data.name}:</td>
                <td className="iw-table-nested__column">{rowData[data.reference]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  )
}

IWExpandedTableSection.propTypes = {
  hiddenTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  isExpanded: PropTypes.bool,
  numberOfColumns: PropTypes.number.isRequired,
  rowData: PropTypes.object.isRequired,
}

IWExpandedTableSection.defaultProps = {
  isExpanded: false,
}
