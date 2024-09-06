/**
 * Formatting function that must be bound to the "this" of the react component calling it
 * @state    {Object}  filters         Filters currently active in the component
 * @state    {Boolean} isCompared      Whether data is being compared to the previous year
 * @props    {Array}   rawData         Data array from back-end
 * @param    {String}  quantity        Property name of the number being accessed
 * @param    {String}  sortingCategory Datapoint property to be formatted to the categorical axis
 * @param    {Object}  filters         Key/Value pairs used to filter the datapoints
 * @param    {Array}   names           Array of strings to customize name of return
 * @setState {Object}  barChartInfo    Contains data (array), barKeys (array), & dataKey (string)
 * @setState {Object}  filters         Key/Value pairs of current filters
 * @setState {String}  sortingCategory Current sorting category for the data
 */
export function formatData(quantity, monthNames, rawData, isCompared, sortingCategory, filters, names) {
  const { startMonth, endMonth } = filters.startMonth && filters.endMonth ? filters : getInitialDates()
  const newFilters = { ...filters, startMonth, endMonth }
  const dateNames = names || buildNames(startMonth, endMonth, monthNames)
  const barChartInfo = isCompared
    ? formatDataWithComparisonForBarChart(rawData, sortingCategory, quantity, newFilters, dateNames)
    : formatDataForBarChart(rawData, sortingCategory, quantity, newFilters, dateNames[0])
  return { barChartInfo, startMonth, endMonth }
}
/**
 * Formats data for a single bar chart when "Compare with Last Year" is inactive
 * @param  {Array}  data         Data from back end, array of objects
 * @param  {String} groupBy      Identify sorting property
 * @param  {String} quantity     Identify the quantity being analyzed
 * @param  {Object} [filters={}] Object containing property/value pairs to filter data, including startMonth and endMonth
 * @param  {String} name         String to name the property for the return numerical data
 * @return {Object}              Data formatted to display in BarChart
 *                                    data is the actual data
 *                                    dataKey is the categorical axis
 *                                    barKeys determines what to plots tot he numerical axis
 */
function formatDataForBarChart(data, groupBy, quantity, filters = {}, name = 'amount') {
  const dataObject = groupByType(data, groupBy, quantity, filters, name)
  const formattedData =
    groupBy === 'month'
      ? sortDataByMonthToArray(dataObject, filters.startMonth, filters.endMonth, [name])
      : sortDataByGroupToArray(dataObject, groupBy)
  const isManufacturer = !!(data[0] && data[0].division)
  const barKeys = buildBarKeys([name], isManufacturer)
  return { data: formattedData, dataKey: groupBy, barKeys }
}

/**
 * Formats data for a double bar chart when "Compare with Last Year" is active
 * @param  {Array}  data         Data from back end, array of objects
 * @param  {String} groupBy      Identify sorting property
 * @param  {String} quantity     Identify the quantity being analyzed
 * @param  {Object} [filters={}] Object containing property/value pairs to filter data, including startMonth and endMonth
 * @param  {Array}  names        Array of strings to name the properties for the return numerical data
 * @return {Array}               Data formatted to display in BarChart
 */
function formatDataWithComparisonForBarChart(data, groupBy, quantity, filters = {}, names = ['amount1', 'amount2']) {
  const dataObject1 = groupByType(data, groupBy, quantity, filters, names[0])
  const dataObject2 = groupByType(modifyByYear(data), groupBy, quantity, filters, names[1], dataObject1)
  const formattedData =
    groupBy === 'month'
      ? sortDataByMonthToArray(dataObject2, filters.startMonth, filters.endMonth, names)
      : sortDataByGroupToArray(dataObject2, groupBy)
  const isManufacturer = !!(data[0] && data[0].division)
  const barKeys = buildBarKeys(names, isManufacturer)
  return { data: formattedData, dataKey: groupBy, barKeys }
}

/**
 * Builds the barKeys array for barCharts
 * @param  {Array}   names          Array of names
 * @param  {Boolean} isManufacturer Denotes if the data is SpendByManfuacturer
 * @return {Array}                  Array containing the barKeys objects for reCharts
 * Each barKey is an object of the form { dataKey, stackId}, where dataKey matches to a property in a dataPoint and stackID identifies dataKeys that will stack
 */
function buildBarKeys(names, isManufacturer) {
  const barKeys = names.reduce((acc, name, idx) => {
    const stackId = idx.toString()
    const nameSet = isManufacturer
      ? [
          { dataKey: `Software ${name}`, stackId },
          { dataKey: `Hardware ${name}`, stackId },
          { dataKey: `Services ${name}`, stackId },
        ]
      : [{ dataKey: name }]
    return [...acc, ...nameSet]
  }, [])
  return barKeys.reverse()
}

/**
 * Iterates over the data and mutates it, handling summation, to format it as needed.
 * @param  {Array}  data                    Data from back end, array of objects
 * @param  {String} groupBy                 Identify sorting property
 * @param  {String} quantity                Identify the quantity being analyzed
 * @param  {object} filters                 Object containing property/value pairs to filter data
 * @param  {String} name                    Name for the current set of data
 * @param  {Object} [initialAccumulator={}] Sets initial value of accumulator for the reduce method when setting up 2nd set of bars
 * @return {Object}                         Object version of filtered and mutated data to display in BarChart
 */
function groupByType(data, groupBy, quantity, filters, name, initialAccumulator = {}) {
  return data.reduce((acc, dataPoint) => {
    if (filters && filterDataPoint(dataPoint, filters)) return acc
    const groupByValue = dataPoint[groupBy]
    const divisionName = dataPoint.division ? `${dataPoint.division} ${name}` : name
    if (dataPoint[quantity] || dataPoint[quantity] === 0) {
      if (acc[groupByValue] && acc[groupByValue][divisionName]) {
        // Sums the quantity if an entry already exists with a quantity
        acc[groupByValue][divisionName] += Math.round(dataPoint[quantity])
      } else if (acc[groupByValue]) {
        //  Sets quantity value if an entry already exists w/o a quantity, used with Comparison
        acc[groupByValue][divisionName] = Math.round(dataPoint[quantity])
      } else if (dataPoint[quantity] || (dataPoint[quantity] === 0 && groupBy === 'month')) {
        // Creates entry with quantity when one does not exist.
        acc[groupByValue] = { [groupBy]: groupByValue, [divisionName]: Math.round(dataPoint[quantity]) }
      }
    }
    return acc
  }, initialAccumulator)
}

/**
 * Takes a dataPoint and filters it according to the filters provided
 * @param  {Object} dataPoint    An individual data point from the data array
 * @param  {String} startMonth   The earliest month to allow, YYYY-MM format
 * @param  {String} endMonth     The latest month to allow, YYYY-MM format
 * @param  {Object} otherFilters Any other filters
 * @return {Boolean}             True if it passes the filters, false otherwise
 */
function filterDataPoint(dataPoint, { startMonth, endMonth = getToday(), ...otherFilters }) {
  const filterBoolean =
    Object.keys(otherFilters).length > 0
      ? Object.entries(otherFilters).reduce(
          (acc, [filterKey, filterValue]) =>
            acc && (!filterValue || dataPoint[filterKey].toUpperCase() === filterValue.toUpperCase()),
          true
        )
      : true
  return !(
    (!startMonth || dataPoint.month.slice(0, 7) >= startMonth.slice(0, 7)) &&
    (!endMonth || dataPoint.month.slice(0, 7) <= endMonth.slice(0, 7)) &&
    filterBoolean
  )
}

/**
 * Adds 1 year to each date when using "Compare with Last Year" and on "Spend by Month"
 * @param  {Array} data Array of objects from back-end
 * @return {Array}      Modified array with 1 year "added" to each date for comparison
 */
function modifyByYear(data) {
  return data.map(entry => {
    const modifiedEntry = { ...entry }
    modifiedEntry.month = addYearToDate(entry.month)
    return modifiedEntry
  })
}

/**
 * [addYearToDate description]
 * @param  {String} date string of date in YYYY-MM or YYYY-MM-DD format
 * @return {String}      modified string with year increased by 1
 */
function addYearToDate(date) {
  const nextYear = Number(date.slice(0, 4)) + 1
  return `${nextYear}${date.slice(4)}`
}

/**
 * Creates a string representing the current year/month
 * @return {String} YYYY-MM-DD format for the current year/month
 */
function getToday() {
  const today = new Date()
  return `${today.getFullYear()}-${today.getMonth() + 1}-01`
}
/**
 * makes a standardized month-year string
 * @param  {number} month  zero-based month number
 * @param  {number} year
 * @return {string}
 */
export function createMonthString(year, month) {
  return `${year}-${month < 10 ? '0' : ''}${month}`
}
function getInitialDates() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const endMonth = `${year}-${month}`
  const startMonth = `${year - (month > 11 ? 0 : 1)}-${month > 11 ? 1 : month + 1}`
  return { startMonth, endMonth }
}
/**
 * Turns the dataObject into an array sorted by date
 * @param  {Object} dataObject Object containing all dataPoints
 * @param  {String} startDate  YYYY-MM format
 * @param  {String} endDate    YYYY-MM format
 * @param  {Array}  names      List of names/datakeys
 * @return {Array}             Formatted array version of dataObject
 */
function sortDataByMonthToArray(dataObject, startDate, endDate, names) {
  const startYear = Number(startDate.slice(0, 4))
  const startMonth = Number(startDate.slice(5))
  let year = startYear
  let month = startMonth
  const formattedData = []
  const entryProps = ['month', ...names]
  while (createMonthString(year, month) <= endDate) {
    const date = createMonthString(year, month)
    formattedData.push(createMonthEntry(entryProps, dataObject[date], date))
    month++
    if (month > 12) {
      year++
      month = 1
    }
  }
  return formattedData
}
/**
 * Turns the dataObject into an array sorted by groupBy
 * @param  {Object} dataObject Object containing all dataPoints
 * @param  {String} groupBy    Property to sort/group by
 * @return {Array}            Formatted array version of dataObject
 */
function sortDataByGroupToArray(dataObject, groupBy) {
  return Object.values(dataObject).sort((a, b) => (a[groupBy] > b[groupBy] ? 1 : -1))
}
/**
 * Injects 0 as a value for all wanted props not present in the dataPoint
 * @param  {Array}  entryProps Props that are required in the dataPoint
 * @param  {Object} dataPoint  Object containing dataPoint values
 * @param  {String} month      YYYY-MM format
 * @return {Object}            Formatted dataPoint
 */
function createMonthEntry(entryProps, dataPoint, month) {
  const entry = {}
  entryProps.forEach(prop => {
    if (prop === 'month') {
      entry.month = month
    } else {
      entry[prop] = dataPoint ? dataPoint[prop] : 0
    }
  })
  return entry
}
/**
 * Builds label names based ont he date range selected
 * @param  {String} startDate  YYYY-MM format
 * @param  {String} endDate    YYYY-MM format
 * @param  {Array}  monthNames Array of 3-letter month names
 * @return {Array}             Array of label names
 */
function buildNames(startDate, endDate, monthNames) {
  const startYear = Number(startDate.slice(0, 4))
  const endYear = Number(endDate.slice(0, 4))
  if (startYear === endYear) return [`${startYear}`, `${startYear - 1}`]
  const startMonth = Number(startDate.slice(5)) - 1
  const endMonth = Number(endDate.slice(5)) - 1
  const names = [
    `${monthNames[startMonth]} ${startYear} - ${monthNames[endMonth]} ${endYear}`,
    `${monthNames[startMonth]} ${startYear - 1} - ${monthNames[endMonth]} ${endYear - 1}`,
  ]
  return names
}
