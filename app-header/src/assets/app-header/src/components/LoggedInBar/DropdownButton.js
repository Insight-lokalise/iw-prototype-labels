import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Button from '@insight/toolkit-react/lib/Button/Button'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

export default function DropdownButton({ children, icon, enabled, ...rest }) {
  const label = (
    <Fragment>
      <Icon icon={icon} className="c-header-nav__icon  c-header-nav__icon--left  c-header-nav__icon--small" />
      <span className="c-header-nav__text  u-truncate">{children}</span>
    </Fragment>
  )

  return enabled ? (
    <Button {...rest} color="none" className="c-header-nav__link">
      {label}
      <Icon icon="arrow-down" className="c-header-nav__icon  c-header-nav__icon--right  c-header-nav__icon--small" />
    </Button>
  ) : (
    <span className="c-header-nav__link  c-header-nav__link--faux">{label}</span>
  )
}

DropdownButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
}

DropdownButton.defaultProps = {
  enabled: false,
}
