/**
 * determine if first date is before second
 * @param  {object}  selection {month, year}
 * @param  {object}  start     {month, year}
 * @return {Boolean}           if the first argument is before the second
 */
export function isFirstArgumentBeforeSecond(first, second) {
  return first.year < second.year || (first.year === second.year && first.month < second.month)
}

/**
 * creates the argument passed into setState, in IWMonthRangePicker, when the user clicks on a month
 * @param  {object} selection     { month, year }
 * @param  {object} currentStart  { month, year }
 * @param  {object} currentEnd    { month, year }
 * @param  {Boolean} startIsActive
 * @param  {Boolean} endIsActive
 * @return {object}               { selectedRange: { start, end }, startIsActive, endIsActive }
 */
export function createRangeStateOnMonthSelection(selection, currentStart, currentEnd, startIsActive, endIsActive) {
  const conditionOne = {
    selectedRange: {
      start: selection,
      end: selection,
    },
    startIsActive: false,
    endIsActive: true,
  }

  const conditionTwo = {
    selectedRange: {
      start: selection,
      end: currentEnd,
    },
    startIsActive: false,
    endIsActive: true,
  }

  const conditionThree = {
    selectedRange: {
      start: currentStart,
      end: selection,
    },
    startIsActive: true,
    endIsActive: false,
  }

  if (startIsActive && endIsActive) {
    return conditionOne
  } else if (isFirstArgumentBeforeSecond(selection, currentStart)) {
    return conditionTwo
  } else if (isFirstArgumentBeforeSecond(currentEnd, selection)) {
    return conditionThree
  } else if (startIsActive) {
    return conditionTwo
  } else if (endIsActive) {
    return conditionThree
  }
  return null
}
