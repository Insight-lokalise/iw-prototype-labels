import React, { useState } from 'react';
import { t } from '@insight/toolkit-utils';
import EmptyState from '../EmptyState/EmptyState';
import ReportOptions from '../ReportOptions/ReportOptions';
import { REPORTING_TEXTS } from '../../texts';
import ReportLayout from '../ReportLayout/ReportLayout';
import ReportDefinitionModal from '../ReportDefinitionModal/ReportDefinitionModal';

const {
  REPORT_HEADERS,
  SCEHDULED_REPORTS,
  SCEHDULED_REPORTS_SUBTEXT,
  REPORT_OPTIONS,
} = REPORTING_TEXTS;

const { VIEW, RENEW } = REPORT_OPTIONS;

const {
  TRACKING_NUMBER,
  REPORT_NAME,
  INTERVAL,
  FORMAT,
  EXPIRY_DATE,
  OPTIONS,
} = REPORT_HEADERS;

const ScheduledReports = ({ reportList = [], loader, fetchReports }) => {
  const reportsClass = 'c-reporting__reports';
  const gridItem2by5Class = 'o-grid__item u-2/5';
  const gridItem3by5Class = 'o-grid__item u-3/5';
  const gridItem1by3Class = 'o-grid__item u-1/3';
  const gridItem2by3Class = 'o-grid__item u-2/3';
  const gridItem1by5Class = 'o-grid__item u-1/5';
  const [viewReport, setViewReport] = useState(null);

  // Rows
  const getScheduledReportsRows = (reports, onDeleteClick, editClick) => {

    if (!reports?.length) {
      const { NO_SCHEDULED_REPORTS: { text, subText } } = REPORTING_TEXTS;
      return <EmptyState text={text} subText={subText} />;
    }

    return reports.map((report) => {
      const {
        reportName, trackingNumber, expirationDate,
        interval, format, options
      } = report;
      const updatedOptions = {
        ...options,
        viewName: t(VIEW),
        viewClick: setViewReport,
        editName: t(RENEW),
        editClick: editClick
      };
      return (
        <div key={trackingNumber} className={`o-grid ${reportsClass}__table-row`}>
          <div className={`o-grid $${gridItem2by5Class}`}>
            <div className={gridItem1by3Class}>
              {trackingNumber}
            </div>
            <div className={gridItem2by3Class}>
              {reportName}
            </div>
          </div>
          <div className={`o-grid $${gridItem3by5Class}`}>
            <div className={gridItem1by5Class}>
              {interval}
            </div>
            <div className={gridItem1by5Class}>
              {format}
            </div>
            <div className={gridItem1by5Class}>
              {expirationDate}
            </div>
            <div className={gridItem2by5Class}>
              <ReportOptions
                options={updatedOptions}
                reportName={reportName}
                trackingNumber={trackingNumber}
                onDeleteClick={onDeleteClick}
              />
            </div>
          </div>
        </div>
      )
    })
  };

  // Headers
  const getScheduledReportsHeaders = () => (
    <div key="header" className={`o-grid ${reportsClass}__table-row u-text-bold`}>
      <div className={`o-grid $${gridItem2by5Class}`}>
        <div className={gridItem1by3Class}>
          {t(TRACKING_NUMBER)}
        </div>
        <div className={gridItem2by3Class}>
          {t(REPORT_NAME)}
        </div>
      </div>
      <div className={`o-grid $${gridItem3by5Class}`}>
        <div className={gridItem1by5Class}>
          {t(INTERVAL)}
        </div>
        <div className={gridItem1by5Class}>
          {t(FORMAT)}
        </div>
        <div className={gridItem1by5Class}>
          {t(EXPIRY_DATE)}
        </div>
        <div className={gridItem2by5Class}>
          {t(OPTIONS)}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {viewReport && (
        <ReportDefinitionModal
          trackingNumber={viewReport?.trackingNumber}
          handleViewReport={setViewReport}
        />
      )}
      <ReportLayout
        loader={loader}
        reportList={reportList}
        fetchReports={fetchReports}
        header={SCEHDULED_REPORTS}
        subText={SCEHDULED_REPORTS_SUBTEXT}
        getHeaders={getScheduledReportsHeaders}
        getRows={getScheduledReportsRows}
      />
    </>
  );
}

export default ScheduledReports;