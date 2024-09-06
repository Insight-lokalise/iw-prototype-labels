/**
 * determines whether a month falls in a range
 * @param  {number}  maxYear
 * @param  {number}  maxMonth    zero-based month number
 * @param  {number}  minYear
 * @param  {number}  minMonth    zero-based month number
 * @param  {number}  month       zero-based month number
 * @param  {number}  year        year to be checked against
 * @return {Boolean}             does month/year combo fall within min/max
 */
export function isMonthWithinRange(maxYear, maxMonth, minYear, minMonth, month, year) {
  if (year === maxYear && year === minYear) {
    return month > minMonth && month < maxMonth
  } else if (maxYear === year) {
    return month <= maxMonth
  } else if (year < maxYear && year > minYear) {
    return true
  } else if (minYear === year) {
    return month >= minMonth
  }
  return false
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
