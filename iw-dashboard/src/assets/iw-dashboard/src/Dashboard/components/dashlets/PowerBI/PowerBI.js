import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'
import { IWLoading } from "../../../../iw-components";
import { powerbi, tokenType } from './helpers'

export default class PowerBI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filters: [],
    }
    this.report = null
    this.loadReport = this.loadReport.bind(this)
    this.loadFilters = this.loadFilters.bind(this)
  }

  componentDidMount() {
    if (!this.props.hasData) {
      this.props.getData(this.props.dashletId)
    } else {
      this.loadReport()
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props
    if (data.accessToken && data.accessToken !== prevProps.data.accessToken) {
      this.loadReport()
    }
  }

  loadReport() {
    const {
      data,
      dashletId,
    } = this.props
    const reportContainer = document.getElementById(`powerbi_${dashletId}`)
    this.report = powerbi.load(reportContainer, { ...data, tokenType })
    this.report.off('loaded')
    this.report.on('loaded', this.loadFilters)
  }

  loadFilters() {
    this.report.updateSettings({filterPaneEnabled: true})
    this.report.render()
  }

  render() {
    const {
      dashletId,
      hasData,
      title,
      toggleThisDashlet,
    } = this.props
    // TODO: Fix headerLink
    return (
      <Dashlet
        headerLink={{ href: 'welcome', text: 'View My Company page' }}
        title={title}
        toggleThisDashlet={toggleThisDashlet}
      >
        { hasData ? (
          <div>
            <div id={`powerbi_${dashletId}`} className='c_dashboard__powerbi-dashlet' />
          </div>
        ) : (
          <div className="dashlet__loading-wrapper">
            <IWLoading />
          </div>
        )}
      </Dashlet>
    )
  }
}

PowerBI.propTypes = {
  data: PropTypes.shape({}),
  hasData: PropTypes.bool,
  getData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toggleThisDashlet: PropTypes.func,
}

PowerBI.defaultProps = {
  data: {},
  hasData: false,
  toggleThisDashlet: undefined,
}
