import React, { useRef, useState } from 'react';
import { t } from '@insight/toolkit-utils';
import { Loading, Pagination, ToastList } from '@insight/toolkit-react';
import { REPORTING_TEXTS } from '../../texts';
import {
  DEFAULT_PAGE,
  REPORTS_PER_PAGE,
  TOAST_FADE_DURATION,
  TOAST_DISPLAY_DURATION,
} from '../../constants';
import { invokeReportUrl } from '../../api/index';
import DeletionModal from '../DeletionModal/DeletionModal';
import { scrollToTopFunc, getLabelWithDynamicKeys, getToastData } from '../../lib/index';

const {
  REPORT_RENEWED_SUCCESSFULLY,
  REPORT_DELETED_SUCCESSFULLY,
  DELETE_CONFIRMATION_MESSAGE,
  FAILED_TO_RENEW_REPORT,
  FAILED_TO_DELETE_REPORT
} = REPORTING_TEXTS;

const ReportLayout = (props) => {
  const {
    loader, reportList, fetchReports,
    header, subText,
    getHeaders, getRows,
  } = props;

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [deletionReport, setDeletionReport] = useState(null);
  const [toasts, setToasts] = useState([]);
  const subTextRef = useRef(null);

  const reportsClass = 'c-reporting__reports';

  const handleActionAndFetch = async (link, successMsg, errMsg) => {
    try {
      await invokeReportUrl(link, t(errMsg));
      setToasts(getToastData(t(successMsg)));
      fetchReports();
      setCurrentPage(DEFAULT_PAGE);
    } catch (e) {
      setToasts(getToastData(t(errMsg), 'danger'));
    }
  };

  const handleRenewReport = async (renewLink) => {
    if (renewLink) {
      handleActionAndFetch(renewLink, REPORT_RENEWED_SUCCESSFULLY, FAILED_TO_RENEW_REPORT);
    }
  };

  // Function to handle Report deletion
  const handleDelete = async (report, confirmDelete) => {
    if (confirmDelete) {
      handleActionAndFetch(deletionReport?.deleteLink, REPORT_DELETED_SUCCESSFULLY, FAILED_TO_DELETE_REPORT);
    }
    setDeletionReport(report);
  }

  // Report Delete Confirmation Toast
  const renderDeleteConfirmationToast = () => (
    <ToastList
      className={`${reportsClass}__toast`}
      dismissToast={() => setToasts([])}
      toastDisplayDuration={TOAST_DISPLAY_DURATION}
      toastFadeDuration={TOAST_FADE_DURATION}
      toasts={toasts}
    />
  );

  if (loader) {
    return <Loading />;
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
    scrollToTopFunc();
    if (subTextRef) {
      subTextRef?.current?.focus?.();
    }
  }

  const totalPages = Math.ceil(reportList?.length / REPORTS_PER_PAGE);
  const currentPageReports = reportList?.slice((currentPage - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE);
  const displayDeletionToast = (toasts?.length > 0);
  const displayDeletionModal = deletionReport && Object.keys(deletionReport)?.length > 0;

  return (
    <>
      {displayDeletionToast && renderDeleteConfirmationToast()}
      {displayDeletionModal && (
        <DeletionModal
          handleDelete={handleDelete}
          message={
            getLabelWithDynamicKeys(DELETE_CONFIRMATION_MESSAGE, {
              reportName: t(deletionReport?.reportName),
              reportType: t(header),
            })
          }
        />
      )}
      <p className={`${reportsClass}__header`}> {t(header)} </p>
      <p className={`${reportsClass}__subText`} tabIndex="0" ref={subTextRef}> {t(subText)} </p>
      <div className={`${reportsClass}__table`}>
        {getHeaders()}
        {getRows(currentPageReports, handleDelete, handleRenewReport)}
      </div>
      {(totalPages > 0) && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageHandler={onPageChange}
        />
      )}
    </>
  );
}

export default ReportLayout;