import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

/**
 * IWLoading can appears as an inline element of its container
 *
 * classNames can be passed which adjust the size of the spinner:
 *  [tiny, small, medium, large, giant, massive]
 *
 * TODO FIX the icon's lopsided-ness (may be exagerated only in IE)
 */
export default function IWLoading(props) {
  return <span className={cn('iw-loading', `iw-loading__size-${props.size}`, props.className)} />
}

IWLoading.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'giant', 'massive']),
}

IWLoading.defaultProps = {
  className: '',
  size: 'medium',
}
