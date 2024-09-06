import React, { useEffect, useState } from 'react'
import { scrollToTopFunc } from '../../lib/ScrollToTop'
import Reports from './Reports'
import AccountSelections from './AccountSelections'
import ScheduleReport from './ScheduleReport'
import FilterProducts from './FilterProducts'
import ReportingFields from './ReportingFields'
import DeliveryOptions from './DeliveryOptions'
import { loadReports } from '../../api'
import { Loading } from '@insight/toolkit-react'
import { REPORTING_TEXTS } from '../../texts'
import { REPORTING_CODE_KEY } from '../../constants'

const { API_WARNINGS } = REPORTING_TEXTS
const NewReports = ({ setReportCode, reportCode }) => {
    const [reportsData, setReportsData] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadReportsData = (code) => {
        setLoading(true)
        loadReports(code)
            .then((response) => {
                setReportsData(response)
                setLoading(false)
                scrollToTopFunc()
            })
            .catch((err) => {
                console.warn(API_WARNINGS.FAILED_TO_LOAD_REPORTS, err)
                setLoading(false)
            })
    }
    useEffect(() => {
        loadReportsData(reportCode)
    }, [reportCode])

    useEffect(() => {
        return () => {
            sessionStorage.removeItem(REPORTING_CODE_KEY)
        }
    }, [])
    if (loading) {
        return <Loading />
    }
    return (
        <div className="c-new-reports">
            <Reports
                setReportCode={setReportCode}
                reportCode={reportCode}
                loadReportsData={loadReportsData}
            />
            <AccountSelections />
            <ScheduleReport />
            <FilterProducts reportsData={reportsData} />
            <ReportingFields reportsData={reportsData} />
            <DeliveryOptions reportsData={reportsData} />
        </div>
    )
}

export default NewReports
