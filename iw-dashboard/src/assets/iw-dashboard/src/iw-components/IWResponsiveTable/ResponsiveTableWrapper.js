import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { addOrDropColumnsIfNecessary, findHighestPriority } from './helpers'

const tableReferenceName = 'renderedResponsiveTable'

const ResponsiveTableWrapper = WrappedIWResponsiveTable =>
  class extends Component {
    constructor(props) {
      super(props)

      const tableColumns = [...props.tableColumns]
      const maxExpandedPriortiy = findHighestPriority(tableColumns)

      this.state = {
        breakpointList: [],
        breakpointListTrackingIndex: null,
        maxExpandedPriortiy,
        visibleTableColumns: tableColumns,
      }

      this.onDivResize = this.onDivResize.bind(this)
      this.createBreakpointList = this.createBreakpointList.bind(this)
    }

    /**
     * callback passed down to the IWTableResizeListener component inside of ResponsiveTableRenderer
     * @param  {object} dimensions passed in from react-measure Measure component
     * see: https://github.com/souporserious/react-measure
     * @return {undefined}
     */
    onDivResize(dimensions) {
      const divWidth = Math.ceil(dimensions.bounds.width)
      const tableWidth = this[tableReferenceName].clientWidth
      const stateChanges = addOrDropColumnsIfNecessary(
        divWidth,
        tableWidth,
        this.state,
        this.props.tableColumns,
        this.createBreakpointList
      )
      if (stateChanges !== null) {
        this.setState({ ...stateChanges })
      }
    }

    /**
     * creates the list of breakpoints by summing up the column widths
     * @param  {array of objects} tableColumns      tableColumns prop
     * @return {array of number}                  list of all of the breakpoints for the table
     */
    createBreakpointList(tableColumns) {
      return tableColumns
        .slice()
        .sort((a, b) => a.priority - b.priority)
        .reduce(
          (acc, curr, index, array) => {
            if (index === 0 || array[index - 1].priority === 1 || curr.priority === array[index - 1].priority) {
              acc[acc.length - 1] += this[`tableColumn-${curr.reference}`].clientWidth
            } else {
              acc.push(acc[acc.length - 1] + this[`tableColumn-${curr.reference}`].clientWidth)
            }
            return acc
          },
          [this['tableColumn-IWRTExpandable'].clientWidth]
        )
    }

    render() {
      const { visibleTableColumns, maxExpandedPriortiy } = this.state
      return (
        <WrappedIWResponsiveTable
          maxExpandedPriortiy={maxExpandedPriortiy}
          onDivResize={this.onDivResize}
          // to access ref of children
          tableColRef={columnReference => el => {
            this[`tableColumn-${columnReference}`] = el
          }}
          tableRef={el => {
            this[tableReferenceName] = el
          }}
          visibleTableColumns={visibleTableColumns}
          {...this.props}
        />
      )
    }
  }

ResponsiveTableWrapper.propTypes = {
  tableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default ResponsiveTableWrapper
