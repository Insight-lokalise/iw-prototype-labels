import React, { Component } from 'react'
import PropTypes from 'prop-types'

import IWTableRow from './IWTableRow'
import IWExpandedTableSection from './IWExpandedTableSection'

/**
 * rows of the responsive table. Expand and show collapsed columns when you click the +
 */
export default class IWExpandableTableRow extends Component {
  constructor(props) {
    super(props)

    this.state = { isExpanded: false }

    this.toggleExpand = this.toggleExpand.bind(this)
  }

  /**
   * toggles whether or not row is expanded
   */
  toggleExpand() {
    const currentState = this.state.isExpanded
    this.setState({ isExpanded: !currentState })
  }

  render() {
    const {
      tableColumns,
      rowData,
      isExpandable,
      maxExpandedPriortiy,
      numberOfColumns,
      visibleTableColumns,
    } = this.props
    const { isExpanded } = this.state

    const hiddenTableColumns = tableColumns.filter(row => row.priority > maxExpandedPriortiy)

    return (
      <tbody className="iw-table__tbody">
        <IWTableRow
          isExpandable={isExpandable}
          isExpanded={isExpanded}
          rowData={rowData}
          visibleTableColumns={visibleTableColumns}
          toggleExpand={this.toggleExpand}
        />
        <IWExpandedTableSection
          isExpanded={isExpanded}
          hiddenTableColumns={hiddenTableColumns}
          numberOfColumns={numberOfColumns}
          rowData={rowData}
        />
      </tbody>
    )
  }
}

IWExpandableTableRow.propTypes = {
  isExpandable: PropTypes.bool.isRequired,
  maxExpandedPriortiy: PropTypes.number.isRequired,
  numberOfColumns: PropTypes.number.isRequired,
  rowData: PropTypes.object.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
}
