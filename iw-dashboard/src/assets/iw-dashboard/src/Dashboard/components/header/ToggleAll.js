import React from 'react'
import PropTypes from 'prop-types'
import { IWAnchor } from '../../../iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

function ToggleAll({ tabName, dashletIds, toggleSectionOfDashlets }) {
  return (
    <div className="row align-middle dashboard__selector-links">
      <div className="column small-9">
        <IWAnchor
          className="dashboard__selector-link"
          onClick={() => toggleSectionOfDashlets(tabName, dashletIds, true)}
        >
          {t('Select all')}
        </IWAnchor>
        <IWAnchor
          className="dashboard__selector-link"
          onClick={() => toggleSectionOfDashlets(tabName, dashletIds, false)}
        >
          {t('Clear all')}
        </IWAnchor>
      </div>
      <div className="column small-3 text-center">
        <span className="dashboard__selector-label dashboard__selector-label--fav">{t('Add to Favorites')}</span>
      </div>
    </div>
  )
}

ToggleAll.propTypes = {
  tabName: PropTypes.string.isRequired,
  dashletIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleSectionOfDashlets: PropTypes.func.isRequired,
}

export default ToggleAll
