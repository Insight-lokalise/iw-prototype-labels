import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function ChatWrapper({ className, children, type, ...rest }) {
  const itemClassName = `c-header-${type}__item`
  const linkClassName = `c-header-${type}__link`
  return (
    <li className={itemClassName}>
        {children}
    </li>
  )
}

ChatWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['top', 'dropdown', 'nav']),
}

ChatWrapper.defaultProps = {
  className: '',
  type: 'top',
}
