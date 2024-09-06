import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { useHistory, useLocation } from 'react-router-dom'

import { SearchContext } from '../Search/SearchContext'

export default function AltPanelHeader({ children, title }) {
  const history = useHistory()
  const location = useLocation()
  const { backSearch } = useContext(SearchContext)

  const handleClick = () => {
    backSearch()
    history.goBack()
  }

  return (
    <div className="o-box o-grid__item u-1/1 u-border-bot u-margin-bot u-padding-top-none">
      <div className="o-grid">
        {location?.state?.search && <a className='o-grid__item u-1/1' onClick={handleClick}>{t('Back to search results')}</a>}
        <h2 className="o-grid__item u-1/1 u-margin-bot-none u-h2">{t(title)}</h2>
        {children && <div className="o-grid__item u-1/1">{children}</div>}
      </div>
    </div>
  )
}

AltPanelHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
}

AltPanelHeader.defaultProps = {
  children: null,
}

