import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import './Dashboard.scss'
import dashletComponents from '../containers/dashlets'
import MobileDashboardHeader from './header/MobileDashboardHeader'

// TODO: Fix for update
export default class MobileDashboard extends Component {
  constructor() {
    super()
    this.state = {
      activeDashlet: null,
    }
    this.changeDashlet = this.changeDashlet.bind(this)
    this.renderDashlet = this.renderDashlet.bind(this)
    this.generateSelectOptions = this.generateSelectOptions.bind(this)
  }

  changeDashlet(activeDashlet) {
    this.setState({ activeDashlet })
  }

  generateSelectOptions() {
    const { Favorites: dashlets } = this.props.availableDashlets
    return dashlets.map(dashlet => ({ label: t(dashlet.title), value: dashlet.id }))
  }

  renderDashlet() {
    const { Favorites: dashlets } = this.props.availableDashlets
    const { activeDashlet } = this.state
    if (activeDashlet) {
      const { id, metaData, title, type } = dashlets.find(dashlet => dashlet.id === activeDashlet.value)
      const { DashletComponent } = dashletComponents[type]
      return <DashletComponent dashletId={id} metaData={metaData} title={title} />
    }
    return <p>{t('Please select a dashlet.')}</p>
  }

  render() {
    const { activeDashlet } = this.state
    const activeClassName = activeDashlet
      ? `dashlet--${generateActiveClassName(activeDashlet.label)}`
      : ''

    return (
      <div className="iw-styles mobile-dashboard">
        <MobileDashboardHeader
          changeDashlet={this.changeDashlet}
          options={this.generateSelectOptions()}
          selection={activeDashlet}
        />
        <div className={`mobile-dashlet ${activeClassName}`}>{this.renderDashlet()}</div>
        <div id="rtp-dashboard-1" />
      </div>
    )
  }
}

function generateActiveClassName(label) {
  return label
    .split(' ')
    .reduce((acc, curr) => {
      if (curr.charAt(0) !== curr.charAt(0).toLowerCase()) {
        curr = curr.charAt(0).toLowerCase() + curr.slice(1, curr.length)
      }
      return acc + curr
    }, '')
}

MobileDashboard.propTypes = {
  availableDashlets: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }))).isRequired,
}
