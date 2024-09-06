export const TIME_FRAME_TYPES = {
  YEAR_TO_DATE: 'YEAR_TO_DATE',
  LAST_TWELVE_MONTHS: 'LAST_TWELVE_MONTHS',
  CUSTOM: 'CUSTOM',
}

export function createYearToDateState(currentMonth, currentYear) {
  return {
    selectedStartDate: { month: 0, year: currentYear },
    selectedEndDate: { month: currentMonth, year: currentYear },
    timeFrame: TIME_FRAME_TYPES.YEAR_TO_DATE,
  }
}

export function createLastTwelveMonthsState(currentMonth, currentYear) {
  return {
    selectedStartDate: {
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      year: currentMonth === 11 ? currentYear : currentYear - 1,
    },
    selectedEndDate: { month: currentMonth, year: currentYear },
    timeFrame: TIME_FRAME_TYPES.LAST_TWELVE_MONTHS,
  }
}

export function createCustomDateState(currentMonth, currentYear, { selectedStartDate, selectedEndDate }) {
  return {
    selectedStartDate: selectedStartDate || { month: 0, year: currentYear },
    selectedEndDate: selectedEndDate || { month: currentMonth, year: currentYear },
    timeFrame: TIME_FRAME_TYPES.CUSTOM,
  }
}

function createDefaultState(currentMonth, currentYear, { selectedStartDate, selectedEndDate }) {
  return selectedStartDate || selectedEndDate
    ? createCustomDateState(currentMonth, currentYear, { selectedStartDate, selectedEndDate })
    : createYearToDateState(currentMonth, currentYear)
}

export function createInitialState(props) {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const defaultState = (() => {
    switch (props.timeFrame) {
      case TIME_FRAME_TYPES.YEAR_TO_DATE:
        return createYearToDateState(currentMonth, currentYear)
      case TIME_FRAME_TYPES.LAST_TWELVE_MONTHS:
        return createLastTwelveMonthsState(currentMonth, currentYear)
      case TIME_FRAME_TYPES.CUSTOM:
        return createCustomDateState(currentMonth, currentYear, props)
      default:
        return createDefaultState(currentMonth, currentYear, props)
    }
  })()
  return {
    currentMonth,
    currentYear,
    ...defaultState,
  }
}
