import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { t } from '@insight/toolkit-utils'

import TabSection from './TabSection'
import { TAB_FAVORITES } from '../constants'
import {
  IWButton,
  IWOverlayAdvanced,
  IWOverlayBody,
  IWOverlayController,
  OverlayPropsProvider,
} from '../../../iw-components'

// Returns a button that toggles to display a series of checkboxes controlling the display of each dashlet
export default class DashletSelector extends Component {
  constructor(props) {
    super(props)
    const { currentTab, tabs } = this.props
    const sections = tabs.reduce((acc, tab) => {
      acc[tab] = currentTab === tab || currentTab === 'Favorites'
      return acc
    }, {})

    this.state = { sections }

    this.toggleSection = this.toggleSection.bind(this)
  }
  // Resets open/close state of sections when navigating to a new tab
  componentDidUpdate(prevProps) {
    if (this.props.currentTab !== prevProps.currentTab) {
      const { currentTab, tabs } = this.props
      const sections = tabs.reduce((acc, tab) => {
        acc[tab] = currentTab === tab || currentTab === 'Favorites'
        return acc
      }, {})
      this.setState({ sections })
    }
  }
  /** toggleSection
   * Toggles section of DashletSelector
   * @param  {String} tab Name of tab
   */
  toggleSection(tab) {
    const sections = { ...this.state.sections }
    sections[tab] = !sections[tab]
    this.setState({ sections })
  }

  render() {
    const { sections } = this.state
    const { active, dashlets, tabOrder, toggleDashlet, toggleSectionOfDashlets } = this.props

    const dashboardSettingsButton = (
      <IWButton
        className="clear no-margin-bot dashboard__btn dashboard__btn--open"
        aria-label={t('Open dashboard settings')}
        type="button"
      >
        <span className="ion-gear-b dashboard__icon" />
        {t('Dashboard settings')}
      </IWButton>
    )

    return (
      <div className="column shrink">
        <IWOverlayAdvanced className="dashboard__settings-overlay">
          <IWOverlayController>{dashboardSettingsButton}</IWOverlayController>
          <IWOverlayBody position={'none'} useDefaultStyles={false}>
            <CSSTransitionGroup
              transitionName={{
                enter: 'dashboard--enter',
                leave: 'dashboard--leave',
              }}
              transitionEnterTimeout={150}
              transitionLeaveTimeout={150}
            >
              <aside className="dashboard__settings">
                <div className="dashboard__settings-header">
                  <div className="row align-middle">
                    <div className="columns shrink">
                      <span className="ion-gear-b dashboard__icon" />
                    </div>
                    <div className="columns">
                      <h2 className="dashboard__settings-heading">{t('Dashboard settings')}</h2>
                    </div>
                    <div className="columns shrink">
                      <OverlayPropsProvider
                        render={overlayProps => (
                          <IWButton
                            aria-label={t('Close dashboard settings')}
                            className="clear no-margin-bot ion-android-close dashboard__btn dashboard__btn--close"
                            onClick={overlayProps.iwOverlay.unmountOverlay}
                            type="button"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                {dashlets &&
                  tabOrder
                    .filter(tabName => dashlets[tabName] && tabName !== TAB_FAVORITES)
                    .map(tabName => (
                      <TabSection
                        key={tabName}
                        tabName={tabName}
                        open={sections[tabName]}
                        dashlets={dashlets[tabName]}
                        toggleSection={this.toggleSection.bind(this, tabName)}
                        toggleDashlet={toggleDashlet}
                        renderToggleAll={this.renderToggleAll}
                        toggleSectionOfDashlets={toggleSectionOfDashlets}
                        activeList={active[tabName]}
                        activeFavoritesList={active.Favorites}
                      />
                    ))}
              </aside>
            </CSSTransitionGroup>
          </IWOverlayBody>
        </IWOverlayAdvanced>
      </div>
    )
  }
}

DashletSelector.propTypes = {
  active: PropTypes.objectOf(PropTypes.shape({ active: PropTypes.bool })),
  currentTab: PropTypes.string.isRequired,
  dashlets: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }))).isRequired,
  tabOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleDashlet: PropTypes.func.isRequired,
  toggleSectionOfDashlets: PropTypes.func.isRequired,
}

DashletSelector.defaultProps = {
  active: {},
  dashlets: {},
}
