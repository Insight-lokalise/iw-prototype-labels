import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton, IWAnchor } from '../../../iw-components'

// Returns a header component common to all dashlets
export default function DashletHeader({ toggleThisDashlet, title, headerLink, headerText }) {
  return (
    <div className="row align-middle expanded collapse dashlet__header">
      <div className="column">
        <h2 className="dashlet__title">{t(title)}</h2>
        {headerLink && (
          <IWAnchor
            href={headerLink.href}
            className="dashlet__link"
            onClick={headerLink.linkFunction}
          >
            {t(headerLink.text)}
          </IWAnchor>
        )}
      </div>
      {headerText && <div className="column shrink dashlet__header-text">{t(headerText)}</div>}
      {toggleThisDashlet && (
        <div className="column shrink">
          <IWButton
            className="clear no-margin-bot ion-android-close dashboard__btn dashboard__btn--close"
            onClick={toggleThisDashlet}
            title={t(`Remove ${title} dashlet`)}
            aria-label={t(`Remove ${title} dashlet`)}
          />
        </div>
      )}
    </div>
  )
}

DashletHeader.propTypes = {
  headerLink: PropTypes.shape({
    href: PropTypes.string,
    linkFunction: PropTypes.func,
    text: PropTypes.string.isRequired,
  }),
  headerText: PropTypes.string,
  title: PropTypes.string.isRequired,
  toggleThisDashlet: PropTypes.func,
}

DashletHeader.defaultProps = {
  headerLink: null,
  headerText: undefined,
  toggleThisDashlet: undefined,
}
