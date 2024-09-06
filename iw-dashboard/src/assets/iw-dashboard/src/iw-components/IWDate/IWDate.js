import React from 'react'
import PropTypes from 'prop-types'

/**
 * renders a date as DD-MMM-YYYY
 * @param {object} props see propTypes
 */
export default function IWDate({ date, monthList, hideDay }) {
  return <span data-testid='iw-date'>{createDisplayDateString(date, monthList, hideDay)}</span>
}

IWDate.propTypes = {
  // date should be a JavaScript Date object
  date: PropTypes.instanceOf(Date).isRequired,
  hideDay: PropTypes.bool,
  monthList: PropTypes.arrayOf(PropTypes.string).isRequired,
}

IWDate.defaultProps = {
  hideDay: false,
}

/**
 * createDisplayDateString
 * @param  {object} date      JS Date object
 * @param  {array} monthList  list of month names. Typically 3 letter abvs
 * @param  {bool}  hideDay    If true, day will be omitted in date string.
 * @return {string}           DD-MMM-YYYY
 */
function createDisplayDateString(date, monthList, hideDay) {
  const day = hideDay ? '' : `${date.getDate()}-`
  const month = date.getMonth()
  const year = date.getFullYear()
  return `${day}${monthList[month]}-${year}`
}
