import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'
import { t } from '@insight/toolkit-utils/lib/labels'

import SelectorRow from './SelectorRow'
import ToggleAll from './ToggleAll'
import { IWButton } from '../../../iw-components'

function TabSection({
  tabName,
  open,
  dashlets,
  toggleSection,
  toggleDashlet,
  toggleSectionOfDashlets,
  activeList,
  activeFavoritesList,
}) {
  const expandText = `Expand ${tabName} section`
  const collapseText = `Collapse ${tabName} section`
  const dashletIds = dashlets.map(dashlet => dashlet.id)
  return (
    <div key={tabName} className="dashboard__selector">
      <div className="row align-middle dashboard__selector-header">
        <h3 className="column dashboard__selector-heading no-margin-bot">{t(tabName)}</h3>
        <IWButton
          className={cn('clear no-margin-bot column shrink dashboard__btn dashboard__btn--toggle', {
            'ion-minus': open,
            'ion-plus': !open,
          })}
          onClick={toggleSection}
          aria-label={open ? t(collapseText) : t(expandText)}
          type="button"
        />
      </div>
      <CSSTransitionGroup
        transitionName={{
          enter: 'dashboard--enter',
          leave: 'dashboard--leave',
        }}
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
        className="dashboard__selector-section"
      >
        {open && (
          <ToggleAll tabName={tabName} dashletIds={dashletIds} toggleSectionOfDashlets={toggleSectionOfDashlets} />
        )}
        {open &&
          dashlets.map(dashlet => (
            <SelectorRow
              key={`menu_${tabName}_${dashlet.id}`}
              dashletId={dashlet.id}
              tabName={tabName}
              dashletName={dashlet.title || dashlet.id}
              toggleDashlet={toggleDashlet}
              active={!!(activeList && activeList[dashlet.id])}
              activeFavorite={activeFavoritesList && activeFavoritesList[dashlet.id]}
            />
          ))}
      </CSSTransitionGroup>
    </div>
  )
}

TabSection.propTypes = {
  tabName: PropTypes.string.isRequired,
  open: PropTypes.bool,
  dashlets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  toggleSection: PropTypes.func.isRequired,
  toggleDashlet: PropTypes.func.isRequired,
  toggleSectionOfDashlets: PropTypes.func.isRequired,
  activeList: PropTypes.objectOf(PropTypes.bool),
  activeFavoritesList: PropTypes.shape({
    active: PropTypes.bool,
  }),
}

TabSection.defaultProps = {
  open: false,
  activeList: {},
  activeFavoritesList: {},
}

export default TabSection
