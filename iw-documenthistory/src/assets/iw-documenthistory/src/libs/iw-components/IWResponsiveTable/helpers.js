/**
 * determins state updates when columns should be added/dropped
 * @param {number} divWidth             width of containing div
 * @param {number} tableWidth           width of contained table
 * @param {object} state                the current state at the time the function is called
 * @param {array} tableColumns          the tableColumns prop
 * @param {function} createBreakpointList method from ResponsiveTableWrapper
 * @return {object}                     object with which setState is called
 */
export function addOrDropColumnsIfNecessary(divWidth, tableWidth, state, tableColumns, createBreakpointList) {
  const { breakpointList, breakpointListTrackingIndex, maxExpandedPriortiy, visibleTableColumns } = state
  const breakpointListLength = breakpointList.length

  // if breakpointList has yet to be created and table is minimum width
  // this condition will only be true the FIRST time the table will resize
  if (tableWidth > divWidth && breakpointListLength === 0) {
    const nextBreakpointList = createBreakpointList(tableColumns)
    const nextBreakpointListLength = nextBreakpointList.length

    const nextNumberOfColumnsToDrop = calculateNumberOfBreakpointsToDrop(
      divWidth,
      nextBreakpointList,
      nextBreakpointListLength - 1
    )

    const nextHeaderData = recursivelyRemoveHighestPriority(
      visibleTableColumns,
      maxExpandedPriortiy,
      nextNumberOfColumnsToDrop
    )

    return {
      breakpointList: nextBreakpointList,
      breakpointListTrackingIndex: nextBreakpointListLength - 1 - nextNumberOfColumnsToDrop,
      maxExpandedPriortiy: findHighestPriority(nextHeaderData),
      visibleTableColumns: nextHeaderData,
    }
    // breakpointList has already been created
  } else if (breakpointListLength > 0) {
    // need to drop column(s)
    if (breakpointListTrackingIndex !== -1 && divWidth < breakpointList[breakpointListTrackingIndex]) {
      const nextNumberOfColumnsToDrop = calculateNumberOfBreakpointsToDrop(
        divWidth,
        breakpointList,
        breakpointListTrackingIndex
      )

      const nextHeaderData = recursivelyRemoveHighestPriority(
        visibleTableColumns,
        maxExpandedPriortiy,
        nextNumberOfColumnsToDrop
      )

      return {
        breakpointListTrackingIndex: breakpointListTrackingIndex - nextNumberOfColumnsToDrop,
        maxExpandedPriortiy: findHighestPriority(nextHeaderData),
        visibleTableColumns: nextHeaderData,
      }
    } else if (
      breakpointListTrackingIndex < breakpointListLength &&
      divWidth >= breakpointList[breakpointListTrackingIndex + 1]
    ) {
      // need to add column(s)
      const nextNumberOfColumnsToAdd = calculateNumberOfBreakpointsToAdd(
        divWidth,
        breakpointList,
        breakpointListTrackingIndex + 1
      )

      const nextHeaderData = recursivelyAddHighestPriority(tableColumns, maxExpandedPriortiy, nextNumberOfColumnsToAdd)

      return {
        maxExpandedPriortiy: findHighestPriority(nextHeaderData),
        visibleTableColumns: nextHeaderData,
        breakpointListTrackingIndex: breakpointListTrackingIndex + nextNumberOfColumnsToAdd,
      }
    }
  }
  return null
}

/**
 * finds the priority value of the header with the highest priortity
 * @param  {array of objects} tableColumns
 * @return {number}      highest priority in tableColumns array
 */
export function findHighestPriority(tableColumns) {
  return tableColumns.reduce((acc, curr) => (acc > curr.priority ? acc : curr.priority), 0)
}

/**
 * filters out the header with the highest priority. Used when removing a column due to crossing a breakpoint
 * @param  {array of objects}                     tableColumns
 * @param  {number} maxExpandedPriortiy max priority to show as a column
 * @return {array of objects}                     tableColumns
 */
export function removeHighestPriority(tableColumns, maxExpandedPriortiy) {
  return tableColumns.filter(datum => datum.priority < maxExpandedPriortiy)
}

/**
 * uses proper tail call to removeHighestPriority
 * @param  {array of objects} tableColumns                tableColumns
 * @param  {number} maxExpandedPriortiy                 max priority to show as a column
 * @param  {number} numberOfRemainingRemovals           remaining number of recursive calls
 * @return {array of objects}                           new tableColumns
 */
export function recursivelyRemoveHighestPriority(tableColumns, maxExpandedPriortiy, numberOfRemainingRemovals) {
  // columns with a priority of 1 (or fewer) will never be dropped from the table
  if (maxExpandedPriortiy <= 1) {
    return tableColumns
  }
  const nextHeaderData = removeHighestPriority(tableColumns, maxExpandedPriortiy)
  return numberOfRemainingRemovals === 1
    ? nextHeaderData
    : recursivelyRemoveHighestPriority(
        nextHeaderData,
        findHighestPriority(nextHeaderData),
        numberOfRemainingRemovals - 1
      )
}

/**
 * finds the next highest priority relative to the current highest priority shown
 * @param  {array of objects} tableColumns
 * @param  {number} maxExpandedPriortiy max priority to show as a column
 * @return {number}                     new maxExpandedPriortiy
 */
export function findNextHighestPriorityToAdd(tableColumns, maxExpandedPriortiy) {
  const maximumPriority = 1000000
  // columns with a priority above 1000000 will never be added
  return tableColumns.reduce(
    (acc, curr) => (curr.priority > maxExpandedPriortiy && curr.priority < acc ? curr.priority : acc),
    maximumPriority
  )
}

/**
 * takes tableColumns and filters out headers with priority above new max expanded priority
 * @param {array of objects} tableColumns
 * @param {number} maxExpandedPriortiy max priority to show as a column
 */
export function addNextHighestPriority(tableColumns, maxExpandedPriortiy) {
  const priorityToAdd = findNextHighestPriorityToAdd(tableColumns, maxExpandedPriortiy)
  return tableColumns.filter(datum => datum.priority <= priorityToAdd)
}

/**
 * uses proper tail call to addHighestPriority
 * @param  {array of objects} tableColumns                tableColumns
 * @param  {number} maxExpandedPriortiy                 max priority to show as a column
 * @param  {number} numberOfRemainingRemovals           remaining number of recursive calls
 * @return {array of objects}                           new tableColumns
 */
export function recursivelyAddHighestPriority(tableColumns, maxExpandedPriortiy, numberOfRemainingAdds) {
  return numberOfRemainingAdds === 1
    ? addNextHighestPriority(tableColumns, maxExpandedPriortiy)
    : recursivelyAddHighestPriority(
        tableColumns,
        findNextHighestPriorityToAdd(tableColumns, maxExpandedPriortiy),
        numberOfRemainingAdds - 1
      )
}

/**
 * determines how many breakpoints have be traversed and thus how many highest priority columns to drop
 * @param  {number} divWidth                    width of the containing div
 * @param  {array of numbers} breakpointList    list of breakpoints for the table
 * @param  {number} lowerBreakpointIndex        index referencing breakpointList
 * @return {number}                             number of breakpoints to drop
 */
export function calculateNumberOfBreakpointsToDrop(divWidth, breakpointList, lowerBreakpointIndex) {
  for (let i = lowerBreakpointIndex; i >= 0; i--) {
    if (divWidth >= breakpointList[i]) {
      return lowerBreakpointIndex - i
    }
  }
  return lowerBreakpointIndex + 1
}

/**
 * determines how many breakpoints have be traversed and thus how many highest priority columns to add
 * @param  {number} divWidth                    width of the containing div
 * @param  {array of numbers} breakpointList    list of breakpoints for the table
 * @param  {number} upperBreakpointIndex        index referencing breakpointList
 * @return {number}                             number of breakpoints to add
 */
export function calculateNumberOfBreakpointsToAdd(divWidth, breakpointList, upperBreakpointIndex) {
  const breakpointListLength = breakpointList.length
  for (let i = upperBreakpointIndex; i < breakpointListLength; i++) {
    if (divWidth < breakpointList[i]) {
      return i - upperBreakpointIndex
    }
  }
  return breakpointListLength - upperBreakpointIndex
}
/**
 * get the visible columns
 * @param  {array} tableColumns
 * @return {array}
 */
export const getVisibleColumns = (tableColumns) => {
  return tableColumns.length !== 0 ? tableColumns.filter((_, index) => index === 0)  : []
}
