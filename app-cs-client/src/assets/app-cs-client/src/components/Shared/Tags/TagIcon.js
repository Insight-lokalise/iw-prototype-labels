import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'

export const tagColors = [
  'deep-pink',
  'fuchsia',
  'maroon',
  'red-fuchsia',
  'red',
  'purple',
  'warm-gray-5',
  'warm-gray-8',
  'warm-gray-11',
  'black-light',
  'turquoise',
  'blue',
  'green',
  'yellow',
]

export default function TagIcon({ className, color = 'black-light', ...rest }) {
  return <Icon className={cn(`c-cs-tags--${color}`, className)} icon="pricetag" {...rest} />
}

TagIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(tagColors).isRequired,
}

TagIcon.defaultProps = {
  className: '',
}
