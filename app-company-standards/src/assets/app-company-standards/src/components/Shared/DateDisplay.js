import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { l } from '@insight/toolkit-utils'

import { selector_locale } from '../../duck'

function mapStateToProps(state) {
  return {
    locale: selector_locale(state).replace('_', '-'),
  }
}

function DateDisplay({ locale, timestamp }) {
  return dateFormat(timestamp, locale)
}

export default connect(mapStateToProps)(DateDisplay)

DateDisplay.propTypes = {
  locale: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
}

export function dateFormat(timestamp, locale) {
  const usedLocale = (locale || l()).replace('_', '-')
  const dateObj = new Date(timestamp)

  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
  }

  const dateOptions = {
    month: 'short',
  }

  const time = dateObj
    .toLocaleTimeString(usedLocale, timeOptions)
    .replace(' ', '')
    .toLowerCase()

  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString(usedLocale, dateOptions)
  const year = dateObj.getFullYear()
  const fullDate = `${day}-${month}-${year}`

  return `${time} ${fullDate}`
}