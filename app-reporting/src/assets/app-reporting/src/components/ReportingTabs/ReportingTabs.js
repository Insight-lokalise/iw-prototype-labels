import React, { useMemo, useState, useEffect } from 'react';
import { t } from '@insight/toolkit-utils';
import { getReports } from '../../api/index';
import { Icon, TabManager } from "@insight/toolkit-react";
import PostedReports from '../PostedReports/PostedReports';
import ReportTemplates from '../ReportTemplates/ReportTemplates';
import ScheduledReports from '../ScheduledReports/ScheduledReports';
import ReportingLists from '../ReportingLists/ReportingLists';
import { REPORTING_TEXTS } from '../../texts';
import { REPORTING_TABS } from '../../constants';

const { NEW_REPORT, REPORT_TEMPLATES, POSTED_REPORTS, SCEHDULED_REPORTS } = REPORTING_TEXTS;
const {
	NEW_REPORT: { icon: NEW_REPORT_ICON, id: NEW_REPORT_ID },
	REPORT_TEMPLATES: { icon: REPORT_TEMPLATES_ICON, id: REPORT_TEMPLATES_ID },
	POSTED_REPORTS: { icon: POSTED_REPORTS_ICON, id: POSTED_REPORTS_ID },
	SCEHDULED_REPORTS: { icon: SCEHDULED_REPORTS_ICON, id: SCEHDULED_REPORTS_ID },
} = REPORTING_TABS;


// Reporting Tabs
const ReportingTabs = () => {
	const [reports, setReports] = useState({});
	const [loader, setLoader] = useState(true);

	// Fetch Reports
	const fetchReports = async () => {
		setLoader(true);
		const response = await getReports();
		const data = response?.data;
		if (data) {
			setReports(data);
		}
		setLoader(false);
	}

	useEffect(() => {
		fetchReports();
	}, []);

	// Tabs
	const getIcon = (icon) => <Icon color="primary" icon={icon} className="c-reporting-tabs__icon" />;

	const tabs = useMemo(() => [
		{
			content: <ReportingLists />,
			id: NEW_REPORT_ID,
			tabIndex: "0",
			name: <>
				{getIcon(NEW_REPORT_ICON)}
				{t(NEW_REPORT)}
			</>,
		},
		{
			content: <ReportTemplates
				reportList={reports?.TEMPLATES}
				loader={loader}
				fetchReports={fetchReports}
			/>,
			id: REPORT_TEMPLATES_ID,
			tabIndex: "0",
			name: <>
				{getIcon(REPORT_TEMPLATES_ICON)}
				{t(REPORT_TEMPLATES)}
			</>,
		},
		{
			content: <PostedReports
				reportList={reports?.POST}
				loader={loader}
				fetchReports={fetchReports}
			/>,
			id: POSTED_REPORTS_ID,
			tabIndex: "0",
			name: <>
				{getIcon(POSTED_REPORTS_ICON)}
				{t(POSTED_REPORTS)}
			</>,
		},
		{
			content: <ScheduledReports
				reportList={reports?.SCHEDULE}
				loader={loader}
				fetchReports={fetchReports}
			/>,
			id: SCEHDULED_REPORTS_ID,
			tabIndex: "0",
			name: <>
				{getIcon(SCEHDULED_REPORTS_ICON)}
				{t(SCEHDULED_REPORTS)}
			</>,
		},
	]);

	return <TabManager
		tabClassName="c-reporting-tabs"
		initialSelectedTab={tabs[0]}
		tabs={tabs}
	/>;
}

export default ReportingTabs;