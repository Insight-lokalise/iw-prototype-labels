import React, {useState, useEffect} from "react";
import {Button, Field} from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { getReportCode } from "../../lib/index";
import { getReportsList } from "../../api/getReportsList";
import { parseReportingLists } from "../../lib/parseReportingLists";
import { CREATE_REPORT, REPORTING_TEXTS } from "../../texts";
const {REPORTS_INFORMATION} = REPORTING_TEXTS
const {BACK_TO_REPORT_LIST} = REPORTING_TEXTS;
const { STANDARD_REPORTS, SELECT_A_REPORT } = CREATE_REPORT;

const Reports = ({reportCode, setReportCode, loadReportsData}) => {
    const [reportList, setReportList] = useState(null);

    useEffect(() => {
        getReportType();
    }, []);

    const getReportType = async() => {
        const response = await getReportsList();
        const data = response?.data;
        const parseData = parseReportingLists(data)
        const standardReports = parseData[STANDARD_REPORTS];
        if (standardReports) {
            setReportList(standardReports);
        }
    }
    const reportOptions = reportList?.map(report => ({text: report.name, value: getReportCode(report.name_link)}))
    const reportsDropdown = reportList && <div className="c-new-reports-category c-new-reports-input-group">
        <div className="c-new-reports-input-group__title">{t(SELECT_A_REPORT)}</div>
        <Field 
            fieldComponent="Select"
            fullWidth
            handleChange={(e) => {
                setReportCode(e.target.value)
                loadReportsData(e.target.value)
            }}
            name="select-report"
            options={reportOptions}
            value={reportCode}
        />
    </div>;

    const rmtLink = <Button color="link" size="small" onClick={() => setReportCode(null)}>{t(BACK_TO_REPORT_LIST)}</Button>

    return (
        <div className="c-new-reports-container">
            <div className="o-grid o-grid--center o-grid--justify-end">
                <div className="o-grid__item u-1/1 u-1/2@tablet">
                    <h2>{t(REPORTS_INFORMATION[reportCode].reportName)}</h2>
                </div>
                <div className="o-grid__item u-1/1 u-1/2@tablet u-text-right">
                    {rmtLink}
                </div>
            </div>
            <div className="o-grid">
                {reportsDropdown}
            </div>
        </div>
    )
}

export default Reports;