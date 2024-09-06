import React, { useState, useEffect }  from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Loading } from '@insight/toolkit-react'
import { fetchPowerBiData } from '../api'
import PropTypes from 'prop-types'
import Select from 'react-select'
import PowerBiReport from './PowerBiReport'

export default function PowerBi({reportName, heading, showFilters, showPageNavigation}) {
  const pageHeading = t(heading)
  const viewReport = t('View report')
  const noReportsFound = t('No reports found')

  const [reportData, setReportData] = useState([])
  const [token, setToken] = useState('')
  const [selectedReport, setSelectedReport] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    document.title = pageHeading

    const getPbiData = async () => {
      const { data } = await fetchPowerBiData(reportName)

      setReportData(data.embedReports)
      setToken(data.embedToken)
      setLoading(false)
    }

    getPbiData()  
  }, [])

  const handleSelectChange = (selectedReport) => {
    setSelectedReport(selectedReport.value)
  }

  const normalizeReportData = reportData.map((report, index) => {
    return {
      label: report.reportName,
      value: index,
    }
  })

  const reportSettings = {
    panes: {
      filters: {
        visible: showFilters,
      },
      pageNavigation: {
        visible: showPageNavigation
      }
    }
  }

  if(loading) return <Loading />

  return(
    <div className="powerbi__container">
      <h2 className="powerbi__header">{pageHeading}</h2>
      <div>
        <div className="c-form__element">
          <label className="c-form__label" htmlFor="select">{viewReport}</label>
          <div className="c-form__control">
            <div className="c-select-container">
              <Select
              className="Select__report"
              options={normalizeReportData}
              onChange={handleSelectChange}
              isDisabled={reportData.length === 0}
              placeholder={`Select report to view`}
              searchable={false}
              clearable={false}
              value={selectedReport}
              />
            </div>
          </div>
        </div>
      </div>
        {reportData.length < 1 ? <h4 className="powerbi__no-report-error">{noReportsFound}</h4> : 
        <PowerBiReport reportData={reportData[selectedReport]} embedToken={token} reportSettings={reportSettings} />
        }
    </div>
  )
}

PowerBi.defaultProps = {
  showFilters: true,
  pageNavigation: true
}

PowerBi.propTypes = {
  reportName: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired
}
