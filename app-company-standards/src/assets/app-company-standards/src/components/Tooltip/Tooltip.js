import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'

const Tooltip = ({optionalTitle = '', children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const classes = cn('c-tooltip', className)
  return (
    <div role="tooltip" className={classes}>
      <Icon
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onKeyPress={(e) => {
          e.preventDefault()
          if (e.which === 32 || e.which === 13) setIsOpen(!isOpen)
        }}
        tabindex="0"
        title={optionalTitle}
        icon="help-circle"
        type="info"
      />
      {isOpen ? <div className="c-tooltip__message u-font-size-tiny">{children}</div> : null}
    </div>
  );
}

Tooltip.propTypes = {
  optionalTitle: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
}

export default Tooltip
