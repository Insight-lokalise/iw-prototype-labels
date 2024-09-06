import React, { Component } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash.throttle'

import Dashboard from './Dashboard'
import MobileDashboard from './MobileDashboard'
import {
  TAB_FAVORITES,
  TAB_LICENSING,
  TAB_NEWS,
  TAB_ORDERS,
  TAB_POWERBI,
  TAB_REPORTING,
  TAB_SEARCH,
} from './constants'
import { postDashboardSettings } from '../../services'
import { IWLoading } from '../../iw-components'

const tabOrder = [TAB_FAVORITES, TAB_ORDERS, TAB_LICENSING, TAB_REPORTING, TAB_SEARCH, TAB_POWERBI, TAB_NEWS]

export default class DashboardWrapper extends Component {
  constructor() {
    super()
    this.state = {
      isMobile: window.innerWidth <= 767,
    }
    this.handleResize = throttle(this.handleResize.bind(this), 300, {
      trailing: true,
      leading: true
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  //  Checking for specific changes to dashboardInfo and saving to back-end
  componentDidUpdate(prevProps) {
    if (!prevProps.dashboardSettings.isLoading && !this.props.dashboardSettings.isLoading) {
      const oldDashboardInfo = JSON.stringify(prevProps.dashboardSettings)
      const newDashboardInfo = JSON.stringify(this.props.dashboardSettings)
      if (!prevProps.dashboardSettings.isLoading && oldDashboardInfo !== newDashboardInfo) {
        postDashboardSettings(this.props.dashboardSettings)
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    const windowWidth = window.innerWidth
    if (this.state.isMobile && windowWidth > 767) {
      this.setState({ isMobile: false })
    } else if (!this.state.isMobile && windowWidth <= 767) {
      this.setState({ isMobile: true })
    }
  }

  render() {
    const {
      userData,
      availableDashlets,
      dashboardSettings,
      addDashlet,
      removeDashlet,
      changeLayout,
      changeSelectedTab,
    } = this.props
    if (userData.isLoading || dashboardSettings.isLoading) {
      return (
        <div className="dashboard__loading-wrapper">
          <IWLoading />
        </div>
      )
    }
    return this.state.isMobile ? (
      <MobileDashboard availableDashlets={availableDashlets} />
    ) : (
      <Dashboard
        addDashlet={addDashlet}
        availableDashlets={availableDashlets}
        changeLayout={changeLayout}
        changeSelectedTab={changeSelectedTab}
        dashboardSettings={dashboardSettings}
        isDashboardLocked={userData.isDashboardLocked}
        removeDashlet={removeDashlet}
        tabOrder={tabOrder}
        isCES={userData.isCES}
      />
    )
  }
}

DashboardWrapper.propTypes = {
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
    isLoading: PropTypes.bool,
    tabs: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        dashlets: PropTypes.objectOf(PropTypes.bool).isRequired,
        layouts: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
      })
    ),
  }).isRequired,
  removeDashlet: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    isDashboardLocked: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
}
