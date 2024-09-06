import React from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

import { getUserPreferencesURL, t } from 'api'

export default function FavoriteLinksSettingsButton() {
  const userPreferencesURL = getUserPreferencesURL()

  return (
    <span className="o-grid o-grid--justify-between">
      <span className="o-grid__item o-grid--center c-header-nav__text">{t('Favorites')}</span>
      <Button
        className="o-grid__item o-grid--center o-grid__item--shrink"
        color="none"
        href={userPreferencesURL}
        onClick={e => e.stopPropagation()}
      >
        <Icon
          icon="settings"
          className="c-header-nav__favorites-preferences-icon c-header-nav__icon  c-header-nav__icon--right"
        />
      </Button>
    </span>
  )
}

FavoriteLinksSettingsButton.propTypes = {}
