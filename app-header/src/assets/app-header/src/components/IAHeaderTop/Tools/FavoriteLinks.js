import React from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Header from '@insight/toolkit-react/lib/Header/Header'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

import { getUserPreferencesURL, t } from 'api'
import { favoriteLinksMap } from './favoriteLinksMap'

export default function FavoriteLinks(props) {
  const userPreferencesURL = getUserPreferencesURL(null)

  return (
    <Header.Top.Dropdown.NestedItem>
      <Button color="none" href={userPreferencesURL} fullWidth className="c-header-dropdown__link">
        <div className="o-grid  o-grid--gutters-small">
          <div className="o-grid__item">{t('Favorites')}</div>
          <div className="o-grid__item  o-grid__item--shrink">{userPreferencesURL && <Icon icon="settings" />}</div>
        </div>
      </Button>
      {props.favoriteLinks.length > 0 && (
        <ul className="o-list-bare c-header-dropdown__list c-header-dropdown__list--nested u-margin-bot-none">
          {props.favoriteLinks.map(link => (
            <Header.Top.Dropdown.Item key={link[Object.keys(link)]} href={link[Object.keys(link)]}>
              {t(favoriteLinksMap[Object.keys(link)[0]] || Object.keys(link)[0])}
            </Header.Top.Dropdown.Item>
          ))}
        </ul>
      )}
    </Header.Top.Dropdown.NestedItem>
  )
}

FavoriteLinks.propTypes = {
  favoriteLinks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}
