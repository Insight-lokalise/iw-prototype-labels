import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { REPORTING_TEXTS } from '../../texts';
import { PAGE_ROUTE } from '../../constants';

const { NEW_REPORT_URL } = PAGE_ROUTE;
const { REPORT_OPTIONS } = REPORTING_TEXTS;
const { DOWNLOAD, DELETE, EDIT, RUN } = REPORT_OPTIONS;

const ReportOptions = (props) => {
  const history = useHistory();
  const { options, className, onDeleteClick, reportName, customFileName, trackingNumber } = props;
  const name = customFileName || reportName;
  const {
    run_flag: runFlag, run_link: runLink,
    edit_flag: editFlag, edit_link: editLink, editName, editClick,
    view_flag: viewFlag, view_link: viewLink, viewName, viewClick,
    delete_flag: deleteFlag, delete_link: deleteLink,
  } = options;

  const reportOptionsClass = 'c-reporting__reportOptions';
  const btnReportOptionsClass = `u-text-bold ${reportOptionsClass}__options-btn`;
  const colorInlineLink = "inline-link";

  const reportOptions = [];
  
  const onLinkRedirection = (link) => {
    const params = link?.split?.('?')?.[1];
    history.push(`${NEW_REPORT_URL}?${params}`);
  }
  
  // RUN
  if (runFlag && runLink) {
    reportOptions.push(
      <Button
        color={colorInlineLink}
        className={btnReportOptionsClass}
        aria-label={`${t(RUN)} ${name}`}
        onClick={(e) => {
          e.preventDefault();
          onLinkRedirection(runLink);
        }}
      >
        {t(RUN)}
      </Button>
    );
  }

  // EDIT
  if (editFlag && editLink) {
    const editButtonName = editName || t(EDIT);
    const onEditClick = editClick || onLinkRedirection;
    reportOptions.push(
      <Button
        color={colorInlineLink}
        className={btnReportOptionsClass}
        aria-label={`${editButtonName} ${name}`}
        onClick={(e) => {
          e.preventDefault();
          onEditClick(editLink);
        }}
      >
        {editButtonName}
      </Button>
    );
  }

  // DOWNLOAD
  if (viewFlag && viewLink) {
    let viewProps = {};
    const viewButtonName = viewName || t(DOWNLOAD);
    if(viewClick) {
      viewProps = {
        onClick: (e) => {
          e.preventDefault();
          viewClick({
            reportName,
            trackingNumber,
            viewLink: viewLink
          });
        },
        className: btnReportOptionsClass,
      };
    }
    else{
      viewProps = {
        href: viewLink,
        className: 'u-text-bold',
      };
    }
    reportOptions.push(
      <Button
        color={colorInlineLink}
        {...viewProps}
        aria-label={`${viewButtonName} ${name}`}
      >
        {viewButtonName}
      </Button>
    );
  }

  // DELETE
  if (deleteFlag && deleteLink) {
    let deletionProps = {};
    if (onDeleteClick) {
      deletionProps = {
        onClick: (e) => {
          e.preventDefault();
          onDeleteClick({
            reportName,
            deleteLink: deleteLink
          });
        },
        className: btnReportOptionsClass,
      };
    } else {
      deletionProps = {
        href: deleteLink,
        className: 'u-text-bold',
      };
    }
    reportOptions.push(
      <Button
        color={colorInlineLink}
        aria-label={`${t(DELETE)} ${name}`}
        {...deletionProps}
      >
        {t(DELETE)}
      </Button>
    );
  }

  return <div className={`o-grid o-grid__item ${reportOptionsClass}__options ${className || ''}`} >
    {reportOptions?.map((option, index) => (
      <React.Fragment key={index}>
        {index ? (<span className={`${reportOptionsClass}__options-separator`}> | </span>) : ''}
        {option}
      </React.Fragment>
    ))}
  </div>
}

export default ReportOptions;