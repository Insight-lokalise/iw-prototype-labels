import React from 'react'

import Button from '@insight/toolkit-react/lib/Button/Button'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'
import { t } from 'api'

export default function FlyoutButton(props) {
  const {openFlyout, handleOnClick} = props;
  return (
    <span className="c-header-nav__item  c-header-nav__item--highlight">
      <Button
        aria-expanded={openFlyout}
        aria-label={t('Open account menu')}
        className="c-header-account-menu__btn  c-header-account-menu__btn--logged-in  c-header-nav__link"
        color="none"
        onClick={handleOnClick}
      >
        <Icon icon="navicon" />
      </Button>
    </span>
  )
}

FlyoutButton.propTypes = {}
