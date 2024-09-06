import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import DashletSelector from './DashletSelector'
import { Tabs, Tab } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { IWAnchor } from '../../../iw-components'

// Returns an array of buttons to act as tabs and the DashletSelector
export default function DashboardHeader({
  tabNames,
  currentTab,
  changeTab,
  active,
  toggleDashlet,
  toggleSectionOfDashlets,
  dashlets,
  isDashboardLocked,
  tabOrder,
}) {
  const tabs = Object.keys(tabNames)
  return (
    <div className="row expanded collapse align-middle dashboard__header">
      <nav role="tablist" className="column dashboard__tabs">
      <Tabs>
        {tabs.map(tab => {
          const hasDashlets = tab === 'Favorites' || (dashlets[tab] && dashlets[tab].length > 0)
          return (
            hasDashlets && (
              <Tab
                key={tab}
                onClick={() => changeTab(tab)}
                isSelected={currentTab === tab}
              >
                {t(tabNames[tab])}
              </Tab>
            )
          )
        })}
      </Tabs>
      </nav>
      { !isDashboardLocked && (
        <DashletSelector
          active={active}
          toggleDashlet={toggleDashlet}
          dashlets={dashlets}
          currentTab={currentTab}
          toggleSectionOfDashlets={toggleSectionOfDashlets}
          tabOrder={tabOrder}
          tabs={tabs}
        />
      )}
    </div>
  )
}

DashboardHeader.propTypes = {
  tabNames: PropTypes.objectOf(PropTypes.string).isRequired,
  currentTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
  active: PropTypes.objectOf(PropTypes.shape({ active: PropTypes.bool })).isRequired,
  dashlets: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }))).isRequired,
  isDashboardLocked: PropTypes.bool.isRequired,
  tabOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleDashlet: PropTypes.func.isRequired,
  toggleSectionOfDashlets: PropTypes.func.isRequired,
}

DashboardHeader.defaultProps = {
  dashlets: {},
}
