import React from 'react';
import { t } from '@insight/toolkit-utils';
import EmptyState from '../EmptyState/EmptyState';
import ReportOptions from '../ReportOptions/ReportOptions';
import ReportLayout from '../ReportLayout/ReportLayout';
import { REPORTING_TEXTS } from '../../texts';

const {
  REPORT_HEADERS,
  REPORT_TEMPLATES,
  REPORT_TEMPLATES_SUBTEXT,
} = REPORTING_TEXTS;

const {
  REPORT_NAME,
  TEMPLATE_NAME,
  LAST_RUN_DATE,
  OPTIONS,
} = REPORT_HEADERS;

const ReportTemplates = ({ reportList = [], loader, fetchReports }) => {

  const reportsClass = 'c-reporting__reports';
  const gridItem1by4Class = `o-grid__item u-1/4`;

  // Rows
  const getReportTemplatesRows = (reports, onDeleteClick) => {
    if (!reports?.length) {
      const { NO_REPORT_TEMPLATES: { text, subText } } = REPORTING_TEXTS;
      return <EmptyState text={text} subText={subText} />;
    }

    return reports.map((report) => {
      const { reportName, trackingNumber, templateName, runDate, options } = report;
      return (
        <div key={trackingNumber} className={`o-grid ${reportsClass}__table-row`}>
          <div className={gridItem1by4Class}>
            {reportName}
          </div>
          <div className={gridItem1by4Class}>
            {templateName}
          </div>
          <div className={gridItem1by4Class}>
            {runDate}
          </div>
          <div className={gridItem1by4Class}>
            <ReportOptions
              options={options}
              reportName={reportName}
              customFileName={templateName}
              onDeleteClick={onDeleteClick}
            />
          </div>
        </div>
      )
    })
  };

  // Headers
  const getReportTemplatesHeaders = () => (
    <div key="header" className={`o-grid ${reportsClass}__table-row u-text-bold`}>
      <div className={gridItem1by4Class}>
        {t(REPORT_NAME)}
      </div>
      <div className={gridItem1by4Class}>
        {t(TEMPLATE_NAME)}
      </div>
      <div className={gridItem1by4Class}>
        {t(LAST_RUN_DATE)}
      </div>
      <div className={gridItem1by4Class}>
        {t(OPTIONS)}
      </div>
    </div>
  );

  return (
		<ReportLayout
			loader={loader}
			reportList={reportList}
			fetchReports={fetchReports}
			header={REPORT_TEMPLATES}
			subText={REPORT_TEMPLATES_SUBTEXT}
			getHeaders={getReportTemplatesHeaders}
			getRows={getReportTemplatesRows}
		/>
	);
}

export default ReportTemplates;