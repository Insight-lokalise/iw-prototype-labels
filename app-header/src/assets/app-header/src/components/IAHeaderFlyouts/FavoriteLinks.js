import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Header from '@insight/toolkit-react/lib/Header/Header'
import { getUserPreferencesURL, t } from 'api'

import { favoriteLinksMap } from '../IAHeaderTop/Tools/favoriteLinksMap'
import FavoriteLinksSettingsButton from './FavoriteLinksSettingsButton'

export default function FavoriteLinks({ favoriteLinks }) {
  function computeNodeMap() {
    return favoriteLinks.map(linkObject => {
      const favoriteLinksMapKey = Object.keys(linkObject)[0]

      return {
        title: t(favoriteLinksMap[favoriteLinksMapKey]),
        href: linkObject[favoriteLinksMapKey],
        type: 'link',
      }
    })
  }

  const nodeMap = useMemo(() => computeNodeMap(favoriteLinks), [favoriteLinks])

  const userPreferencesURL = getUserPreferencesURL()
  return nodeMap.length > 0 ? (
    <Header.Flyout.MegaMenu id="headerMobileFavoriteLinks" title={<FavoriteLinksSettingsButton />}>
      <div className="c-header-mega-menu__section">
        <div className="o-wrapper">
          <div className="o-grid  o-grid--gutters-large">
            {nodeMap.map(submenuNode => (
              <div key={submenuNode.title} className="o-grid__item  u-1/1  u-width-auto@desktop">
                <Header.MegaMenu.Menu.Item key={submenuNode.title} href={submenuNode.href}>
                  {submenuNode.title}
                </Header.MegaMenu.Menu.Item>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Header.Flyout.MegaMenu>
  ) : (
    <Header.Flyout.Item href={userPreferencesURL} icon="settings">
      {t('Favorites')}
    </Header.Flyout.Item>
  )
}

FavoriteLinks.propTypes = {
  favoriteLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
}
