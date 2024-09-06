import React from 'react';
import { t } from '@insight/toolkit-utils';
import EmptyState from '../EmptyState/EmptyState';
import ReportOptions from '../ReportOptions/ReportOptions';
import ReportLayout from '../ReportLayout/ReportLayout';
import { REPORTING_TEXTS } from '../../texts';

const {
	REPORT_HEADERS,
	POSTED_REPORTS,
	POSTED_REPORTS_SUBTEXT,
} = REPORTING_TEXTS;

const {
	REPORT_NAME,
	CUSTOM_REPORT_NAME,
	INTERVAL,
	RUN_DATE,
	FORMAT,
	OPTIONS,
} = REPORT_HEADERS;

const PostedReports = ({ reportList = [], loader, fetchReports }) => {

	const reportsClass = 'c-reporting__reports';
	const gridItem2by5Class = 'o-grid__item u-2/5';
	const gridItem3by5Class = 'o-grid__item u-3/5';
	const gridItem1by2Class = `o-grid__item u-1/2`;
	const gridItem1by4Class = `o-grid__item u-1/4`;

	const getPostedReportsRows = (reports, onDeleteClick) => {
		if (!reports?.length) {
			const { NO_POSTED_REPORTS: { text, subText } } = REPORTING_TEXTS;
			return <EmptyState text={text} subText={subText} />;
		}

		return reports.map((report) => {
			const {
				reportName, trackingNumber, customFileName,
				interval, runDate, format, options
			} = report;
			return (
				<div key={trackingNumber} className={`o-grid ${reportsClass}__table-row`}>
					<div className={`o-grid $${gridItem2by5Class}`}>
						<div className={gridItem1by2Class}>
							{reportName}
						</div>
						<div className={gridItem1by2Class}>
							{customFileName}
						</div>
					</div>
					<div className={`o-grid $${gridItem3by5Class}`}>
						<div className={gridItem1by4Class}>
							{interval}
						</div>
						<div className={gridItem1by4Class}>
							{runDate}
						</div>
						<div className={gridItem1by4Class}>
							{format}
						</div>
						<div className={gridItem1by4Class}>
							<ReportOptions
								options={options}
								reportName={reportName}
								customFileName={customFileName}
								onDeleteClick={onDeleteClick}
							/>
						</div>
					</div>
				</div>
			)
		})
	};

	// Headers
	const getPostedReportsHeaders = () => (
		<div key="header" className={`o-grid ${reportsClass}__table-row u-text-bold`}>
			<div className={`o-grid $${gridItem2by5Class}`}>
				<div className={gridItem1by2Class}>
					{t(REPORT_NAME)}
				</div>
				<div className={gridItem1by2Class}>
					{t(CUSTOM_REPORT_NAME)}
				</div>
			</div>
			<div className={`o-grid $${gridItem3by5Class}`}>
				<div className={gridItem1by4Class}>
					{t(INTERVAL)}
				</div>
				<div className={gridItem1by4Class}>
					{t(RUN_DATE)}
				</div>
				<div className={gridItem1by4Class}>
					{t(FORMAT)}
				</div>
				<div className={gridItem1by4Class}>
					{t(OPTIONS)}
				</div>
			</div>
		</div>
	);

	return (
		<ReportLayout
			loader={loader}
			reportList={reportList}
			fetchReports={fetchReports}
			header={POSTED_REPORTS}
			subText={POSTED_REPORTS_SUBTEXT}
			getHeaders={getPostedReportsHeaders}
			getRows={getPostedReportsRows}
		/>
	);
};

export default PostedReports;