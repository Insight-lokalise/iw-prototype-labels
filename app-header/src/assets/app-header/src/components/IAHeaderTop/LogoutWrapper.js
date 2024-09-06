import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'

export default function logoutWrapper({ children, href, onClick}) {
  return (
    <li className="c-header-nav__item c-header-nav__item--last">
        <Button
            className="c-header-nav__link"
            color="none"
            onClick={onClick}
            href={href}
        >
            <Icon icon="logout" className="c-header-nav__icon  c-header-nav__icon--left" />
            <span className="c-header-nav__text">{children}</span>
        </Button>
    </li>
  )
}

logoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}
