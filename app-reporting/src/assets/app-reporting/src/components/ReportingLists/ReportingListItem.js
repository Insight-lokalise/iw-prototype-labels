import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Panel } from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import ReportingListColumns from './ReportingListColumns';
import { getReportCode } from '../../lib/index';
import { REPORTING_TEXTS } from '../../texts';
import { PAGE_ROUTE, REPORTING_CODE_KEY } from '../../constants';

const {
	CREATE_REPORT,
	REPORT,
	CSV,
	XLS,
	REPORT_FORMATS,
	SCHEDULED_REPORTING,
	GLOBAL_REPORT,
	REPORTS_INFORMATION,
	REPORT_OPTIONS: { DOWNLOAD },
} = REPORTING_TEXTS;

const { NEW_REPORT_URL } = PAGE_ROUTE;

// --------------------
// Reporting List Item
// --------------------
const ReportingListItem = (props) => {
	const { reportCategory, reportCategoryData, setReportCode } = props;
	const accordianClass = 'c-reporting-listItem__accordion';

	// Actions for individual report
	const getReportActions = (item, reportCode) => {
		const { name_link, csv_link, xls_link } = item;

		return name_link ? (
			<Button
				color='link'
				size="small"
				aria-label={t(CREATE_REPORT)}
				onClick={() => setReportCode(reportCode)}
			>
				{t(CREATE_REPORT)}
			</Button>
		) : (<>
			<Button
				color='link'
				size="small"
				href={csv_link}
				aria-label={`${t(DOWNLOAD)} ${t(CSV)} ${t(REPORT)}`}
			>
				{t(CSV)}
			</Button> |
			<Button
				color='link'
				size="small"
				href={xls_link}
				aria-label={`${t(DOWNLOAD)} ${t(XLS)} ${t(REPORT)}`}
			>
				{t(XLS)}
			</Button>
		</>);
	}

	// Content when Accordian is expanded
	const getReportContent = (report) => {
		const { reportInfo, reportFormats, schedule, globalReport } = report;
		const accordianInfo = `${accordianClass}-info`;
		const accordianInfoDiv = `o-grid__item u-1/3 ${accordianInfo}`;
		return <>
			<p className={`${accordianClass}-description`}>{reportInfo}</p>
			<div className="o-grid">
				{reportFormats && (
					<div className={accordianInfoDiv}>
						<p className={`${accordianInfo}-tab`}>{t(REPORT_FORMATS)}</p>
						{reportFormats}
					</div>
				)}
				{schedule && (
					<div className={accordianInfoDiv}>
						<p className={`${accordianInfo}-tab`}>{t(SCHEDULED_REPORTING)}</p>
						{schedule}
					</div>
				)}
				{globalReport && (
					<div className={accordianInfoDiv}>
						<p className={`${accordianInfo}-tab`}>{t(GLOBAL_REPORT)}</p>
						{globalReport}
					</div>
				)}
			</div>
		</>
	}

	// List of Reports
	const getReports = () => reportCategoryData?.map((item) => {
		const { name, name_link } = item;
		const reportCode = getReportCode(name_link);
		const report = REPORTS_INFORMATION?.[reportCode] || REPORTS_INFORMATION?.[name];
		if (report) {
			const reportName = report?.reportName;
			return {
				content: getReportContent(report),
				id: reportName?.replace?.(/ /g, "-"),
				label: t(reportName),
				removeAriaLabelledBy: true,
				className: {
					item: `${accordianClass}-item`,
					panel: `${accordianClass}-panel`,
					control: `${accordianClass}-controls`,
					trigger: `${accordianClass}-trigger`,
					action: `${accordianClass}-action`,
				},
				extraAction: getReportActions(item, reportCode),
			}
		}
		return null;
	}).filter((item) => item);

	const reportList = getReports();
	if (reportList?.length === 0) {
		return null;
	}

	return (
		<Panel className="c-reporting-panel">
			<Panel.Title className='c-reporting-panel-title' tabIndex="0">
				{reportCategory}
			</Panel.Title>
			<Panel.Body className='c-reporting-panel-body'>
				<ReportingListColumns reportList={reportList} />
			</Panel.Body>
		</Panel>
	);
}

export default ReportingListItem