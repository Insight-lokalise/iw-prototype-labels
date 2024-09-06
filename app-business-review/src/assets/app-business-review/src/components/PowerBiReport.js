import React, { useEffect }  from 'react'
import { powerbi, tokenType } from './helper'
import PropTypes from 'prop-types'

export default function PowerBiReport({reportData, embedToken, reportSettings}) {
  let report = null
  const config = {
    type: 'report',
    tokenType,
    accessToken: embedToken,
    embedUrl: reportData.embedUrl,
  }

  useEffect(() => {
    loadReport()
  },[reportData])
  
  const loadReport = () => {
    const reportContainer = document.getElementById('powerbi__report')
    report = powerbi.load(reportContainer, config)
    report.off('loaded')
    report.on('loaded', loadFilters)
  }

  const loadFilters = () => {
    report.updateSettings(reportSettings)
    report.render()
  }

  return (
    <div id="powerbi__report" />
  )
}

PowerBiReport.propTypes = {
  reportData: PropTypes.object.isRequired,
  embedToken: PropTypes.string.isRequired
}
