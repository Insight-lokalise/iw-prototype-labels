import React from 'react';
import { t } from '@insight/toolkit-utils';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@insight/toolkit-react';
import { REPORTING_TEXTS } from '../../texts';
import { PAGE_ROUTE } from '../../constants';

const { NEW_REPORT_URL } = PAGE_ROUTE;

const EmptyState = ({ text, subText }) => {
  const history = useHistory();
  const emptyStateClass = 'c-reporting__empty-state';

  const handleButtonClick = () => {
    // TODO - Update Route for new report here
		history.push(`${NEW_REPORT_URL}`);
  }

  return (
    <div className={emptyStateClass}>
      <Icon icon="file-preview" color="primary" className={`${emptyStateClass}__empty-icon`} />
      <p className={`${emptyStateClass}__text`}> {t(text)} </p>
      <p className={`${emptyStateClass}__subText`}> {t(subText)} </p>
      <Button
        color="primary"
        className={`${emptyStateClass}__button`}
        onClick={handleButtonClick}
        aria-label={`${t(text)} ${t(REPORTING_TEXTS.CREATE)} ${t(REPORTING_TEXTS.NEW_REPORT)}`}
      >
        <Icon icon="plus-icon" color="primary"/>
        {t(REPORTING_TEXTS.NEW_REPORT)}
      </Button>
    </div>
  )
}

export default EmptyState;