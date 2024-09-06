import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Responsive from 'react-grid-layout/build/ResponsiveReactGridLayout'
import WidthProvider from 'react-grid-layout/build/components/WidthProvider'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { t } from '@insight/toolkit-utils/lib/labels'

import './Dashboard.scss'
import DashboardHeader from './header/DashboardHeader'
import dashletComponents from '../containers/dashlets'

const ResponsiveReactGridLayout = WidthProvider(Responsive)
// Constants to control the width and sizing of the dashboard
const rowHeight = 300
const columnWidth = 600
const numberOfColumns = 2
const maxGridWidth = numberOfColumns * columnWidth
const breakpoints = {
  lg: maxGridWidth - 1,
  xs: 0,
}
const cols = { lg: numberOfColumns, xs: numberOfColumns / 2 }

export default class Dashboard extends Component {
  constructor() {
    super()
    this.onLayoutChange = this.onLayoutChange.bind(this)
    this.toggleDashlet = this.toggleDashlet.bind(this)
    this.toggleSectionOfDashlets = this.toggleSectionOfDashlets.bind(this)
    this.activeDashlets = this.activeDashlets.bind(this)
  }
  /** onLayoutChange
   * Hook for react-grid-layout to gain access to the layouts and save them
   * @param  {Object} layout  discarded
   * @param  {Object} layouts layout per tab to be saved to back-end, state, or local storage
   */
  onLayoutChange(layout, layouts) {
    const { dashboardSettings: { currentTab }, changeLayout } = this.props
    changeLayout(layouts, currentTab)
  }
  /** toggleDashlet
   * Toggles display of a dashlet
   * @param  {String} id  ID of dashlet
   * @param  {String} tab Name of tab
   */
  toggleDashlet(id, tab) {
    const { addDashlet, removeDashlet } = this.props
    const status = this.props.dashboardSettings.tabs[tab].dashlets[id]
    if (status) {
      removeDashlet(id, tab)
    } else {
      addDashlet(id, tab)
    }
  }
  /** toggleSectionOfDashlets
   * Selects or deselects all dashlets for a given tab
   * @param  {String}  tab  Name of tab
   * @param  {Array}   dashlets List of dashlet names
   * @param  {Boolean} status   Render status
   */
  toggleSectionOfDashlets(tab, dashlets, status) {
    const { addDashlet, removeDashlet } = this.props
    dashlets.forEach(id => {
      if (status) {
        addDashlet(id, tab)
      } else {
        removeDashlet(id, tab)
      }
    })
  }
  /** generateDashletToTabArray
   * Generates Object of arrays
   * @return {Object} Object that matches each tab to an array of the dashlets it may contain
   */
  activeDashlets() {
    const { tabOrder, dashboardSettings: { tabs } } = this.props
    return tabOrder.reduce((acc, tab) => {
      acc[tab] = tabs[tab] ? tabs[tab].dashlets : {}
      return acc
    }, {})
  }
  /** generateTabNameObject
   * generates an object
   * @return {Object} Object matching tab IDs to their names in proper order.
   */
  generateTabNameObject() {
    const { tabOrder, dashboardSettings: { tabs } } = this.props
    return tabOrder.reduce((acc, tab) => {
      acc[tab] = tabs[tab] && tabs[tab].name ? tabs[tab].name : tab
      return acc
    }, {})
  }
  /** renderDashlets
   * Renders all dashlets enabled for the current tab
   * @return {Array} Array of dashlets in JSX
   */
  renderDashlets() {
    const { availableDashlets, dashboardSettings, isDashboardLocked, isCES } = this.props
    const { currentTab } = dashboardSettings
    const { dashlets } = dashboardSettings.tabs[currentTab]
    return Object.keys(dashlets)
      .filter(dashletId => dashlets[dashletId])
      .map(dashletId => {
        const { metadata, title, type } = availableDashlets[currentTab].find(dashlet => dashlet.id === dashletId)
        const { DashletComponent, gridProps } = dashletComponents[type]
        return (
          <div
            className={`dashlet dashlet--tab-${currentTab.toLowerCase()} dashlet--${dashletId}`}
            data-grid={gridProps}
            key={`${currentTab}_${dashletId}`}
          >
            <DashletComponent
              metaData={metadata}
              title={title || dashletId}
              dashletId={dashletId}
              toggleThisDashlet={isDashboardLocked ? undefined : () => this.toggleDashlet(dashletId, currentTab)}
              isCES={isCES}
            />
          </div>
        )
      })
  }

  render() {
    const {
      availableDashlets,
      changeSelectedTab,
      dashboardSettings: { currentTab, tabs },
      isDashboardLocked,
      tabOrder
    } = this.props
    const selectedTab = tabs[currentTab]
    const hasDashlets = selectedTab && Object.values(selectedTab.dashlets).includes(true)
    // .react-grid-item.react-grid-placeholder is the selector for the placeholder drop-shadow.
    return (
      <div className="iw-styles dashboard">
        <DashboardHeader
          tabNames={this.generateTabNameObject()}
          currentTab={currentTab}
          changeTab={changeSelectedTab}
          dashlets={stripEmptyTabs(availableDashlets)}
          isDashboardLocked={isDashboardLocked}
          toggleDashlet={this.toggleDashlet}
          toggleFavorite={this.toggleFavorite}
          active={this.activeDashlets()}
          tabOrder={tabOrder}
          toggleSectionOfDashlets={this.toggleSectionOfDashlets}
        />
        {hasDashlets ? (
          <ResponsiveReactGridLayout
            breakpoints={breakpoints}
            className="dashboard__grid"
            cols={cols}
            draggableHandle=".dashlet__header"
            isDraggable={!isDashboardLocked}
            isResizable={!isDashboardLocked}
            layouts={selectedTab.layouts}
            margin={[15, 15]}
            onLayoutChange={this.onLayoutChange}
            rowHeight={rowHeight}
          >
            {this.renderDashlets()}
          </ResponsiveReactGridLayout>
        ) : (
          <section className="row expanded align-middle align-center text-center dashboard__empty-tab-wrapper">
            <div className="column small-12 medium-shrink">
              <div className="dashboard__empty-tab">
                <h3>{t("You haven't added any dashlets yet")}</h3>
                <p className="no-margin-bot">
                  {t('To add a dashlet please select it from the Dashboard settings')}
                </p>
              </div>
            </div>
          </section>
        )}
        <div id="rtp-dashboard-1" />
      </div>
    )
  }
}

Dashboard.propTypes = {
  addDashlet: PropTypes.func.isRequired,
  availableDashlets: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }))).isRequired,
  changeLayout: PropTypes.func.isRequired,
  changeSelectedTab: PropTypes.func.isRequired,
  dashboardSettings: PropTypes.shape({
    currentTab: PropTypes.string.isRequired,
    tabs: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        dashlets: PropTypes.objectOf(PropTypes.bool).isRequired,
        layouts: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
      })
    ).isRequired,
  }).isRequired,
  isDashboardLocked: PropTypes.bool.isRequired,
  removeDashlet: PropTypes.func.isRequired,
  tabOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  isCES: PropTypes.bool.isRequired,
}

/**
 * Filters and organizes dashlets by permissions to appropriate tabs
 * @param  {Object} availableDashlets Object indicating which tabs are allowed on which tabs
 * @return {Object}                   Object organized by tab with dashlet to title indicated
 */
function stripEmptyTabs(availableDashlets) {
  const stripped = Object.keys(availableDashlets).reduce((acc, tab) => {
    if (availableDashlets[tab].length > 0) {
      acc[tab] = availableDashlets[tab]
    }
    return acc
  }, {})
  return stripped
}
