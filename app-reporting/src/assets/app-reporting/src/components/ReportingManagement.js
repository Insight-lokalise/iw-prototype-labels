import React, { useContext } from 'react';
import { t } from '@insight/toolkit-utils';
import { checkUserAccess } from '../lib/index';
import { ReportingContext } from '../context/ReportingContext';
import AccessDenied from './AccessDenied/AccessDenied';
import ReportingTabs from './ReportingTabs/ReportingTabs';
import { REPORTING_TEXTS } from '../texts';
import { REPORTING_PERMISSIONS } from '../constants';

const { REPORTING_MANAGEMENT_TITLE } = REPORTING_TEXTS;

const ReportingManagement = () => {
	const { permissions } = useContext(ReportingContext);
	const isReportingAccessible = checkUserAccess(REPORTING_PERMISSIONS.reports, permissions);
	if (!isReportingAccessible) {
		return <AccessDenied />;
	}

	return <div>
		<h2>{t(REPORTING_MANAGEMENT_TITLE)}</h2>
		<ReportingTabs />
	</div>
}

export default ReportingManagement;