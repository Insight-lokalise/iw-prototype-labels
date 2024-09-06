import PropTypes from 'prop-types'
import cn from 'classnames'
import React from 'react'

/**
 * A Message is a simple string of text with an icon. We use some standard icons
 * for the messages across the site. You may set the icon by passing in a severity
 * flag. This is commonly, but not solely, used with MessageBox. You may just as easily
 * pass this message component its text and severity fields from internal component state.
 *
 * Only renders if it receives a non-null, non-empty text property.
 * May optionally hide the icon via the @prop hideIcon boolean.
 *
 * @param {Object} props
 */
export function IWMessage(props) {
  const severity = severityMap[props.severity || 'info']
  if (props.text == null || props.text === '') return null
  return (
    <div
      className={cn({
        'row row__gutter--tiny collapse iw-message': true,
        [props.className]: props.className,
      })}
    >
      {!props.hideIcon ? (
        <span
          className={`columns shrink iw-message__icon iw-message__icon--${props.severity} ${severity.iconClass}`}
        ></span>
      ) : null}
      <span
        className={`columns iw-message__text iw-message__text--${props.severity}`}
      >
        {props.text}
      </span>
    </div>
  )
}

IWMessage.propTypes = {
  text: PropTypes.string,
  severity: PropTypes.oneOf(['error', 'warn', 'info', 'success']),
  msgId: PropTypes.string,
  hideIcon: PropTypes.bool,
  className: PropTypes.string,
}

/**
 * Map of severity to standardized message classes. Might be helpful if creating
 * your own type of Message.
 * @type {Object}
 */
export const severityMap = {
  error: {
    iconClass: 'ion-android-alert',
  },
  warn: {
    iconClass: 'ion-android-warning',
  },
  info: {
    iconClass: 'ion-ios-information',
  },
  success: {
    iconClass: 'ion-checkmark-circled',
  },
}
