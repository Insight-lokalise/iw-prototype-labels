import React, { Fragment, useContext } from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'

import { jumpToLinkedSite, t } from 'api'
import IAHeaderContext from '../../../context/IAHeaderContext'
import MenuDivider from '../MenuDivider'

export default function LinkedSites() {
  const {
    headerInfo: {
      userInformation: { availableSites, username },
    },
  } = useContext(IAHeaderContext)

  const hasLinkedSites = availableSites && availableSites.length > 0

  return hasLinkedSites ? (
    <Fragment>
      <MenuDivider />
      <h3 className="c-header-dropdown__title" id="my_linked_sites">
        {t('My linked sites')}
      </h3>
      <ul
        className="o-list-bare  c-header-dropdown__list  u-margin-bot-none"
        aria-labelledby="my_linked_sites"
      >
        {availableSites.map((site) => (
          <li className="c-header-dropdown__item" key={site.id}>
            <Button
              color="none"
              className="c-header-dropdown__link"
              fullWidth
              onClick={() =>
                jumpToLinkedSite({
                  siteName: site.name,
                  url: site.nav,
                })
              }
              role="link"
            >
              {t(site.display || site.name)}
            </Button>
          </li>
        ))}
      </ul>
    </Fragment>
  ) : null
}

LinkedSites.propTypes = {}
