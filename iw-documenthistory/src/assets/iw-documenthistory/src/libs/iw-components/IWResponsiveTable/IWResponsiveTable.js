import React from 'react'
import PropTypes from 'prop-types'

import { IWResizeListener } from '../'
import IWResponsiveTableHead from './IWResponsiveTableHead'
import ResponsiveTableWrapper from './ResponsiveTableWrapper'
import RTRow from './RTRow'

// TODO: add support for custom RTHead
/**
 * a responsive table that hides columns based on available space and puts the hidden info into expandable sections
 */
function IWResponsiveTable(props) {
  const { maxExpandedPriortiy, onDivResize, tableColRef, tableColumns, tableRef, visibleTableColumns } = props

  const numberOfVisibleColumns = visibleTableColumns.length
  const hasCollapsedColumns = tableColumns.length - numberOfVisibleColumns > 0

  const children = React.Children.map(
    props.children,
    child =>
      child.type === RTRow
        ? React.cloneElement(child, {
            maxExpandedPriortiy,
            tableColumns,
            visibleTableColumns,
            isExpandable: hasCollapsedColumns,
            numberOfColumns: numberOfVisibleColumns,
          })
        : child
  )

  return (
    <div>
      <table ref={tableRef} className="iw-table">
        <IWResponsiveTableHead visibleTableColumns={visibleTableColumns} tableColRef={tableColRef} />
        {children}
      </table>
      <IWResizeListener onResize={onDivResize} />
    </div>
  )
}

IWResponsiveTable.propTypes = {
  // explicit
  tableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  // implicit
  maxExpandedPriortiy: PropTypes.number,
  onDivResize: PropTypes.func,
  tableColRef: PropTypes.func,
  tableRef: PropTypes.func,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ),
}

export default ResponsiveTableWrapper(IWResponsiveTable)
