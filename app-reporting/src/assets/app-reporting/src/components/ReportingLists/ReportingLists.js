import React, { useEffect, useState } from 'react';
import { getReportsList } from '../../api';
import { Loading } from '@insight/toolkit-react';
import ReportingListItem from './ReportingListItem';
import ReportMessaging from '../ReportMessaging/ReportMessaging';
import { parseReportingLists } from '../../lib/index';
import NewReports from '../NewReports/NewReports';
import {REPORTING_CODE_KEY} from '../../constants';

const ReportingLists = () => {
	const [reportingData, setReportingData] = useState({});
	const [loader, setLoader] = useState(true);
	const [reportCode, setReportCode] = useState(null);
	const fetchReportingList = async () => {
		const response = await getReportsList();
		const data = response?.data;
		if (data) {
			const reportingData = parseReportingLists(data);
			setReportingData(reportingData);
		}
		setLoader(false);
	}

	useEffect(() => {
		fetchReportingList();
	}, []);

	useEffect(() => {
        const session = sessionStorage.getItem(REPORTING_CODE_KEY);
        setReportCode(session);
    }, []);

	if (loader) {
		return <Loading />;
	}

	if (!(reportingData && Object.keys(reportingData)?.length)) {
		return <ReportMessaging />;
	}

	const setReportCodeHandler = (code) => {
		if(code){
			setReportCode(code);
			sessionStorage.setItem(REPORTING_CODE_KEY, code);
		} else {
			setReportCode(null);
			sessionStorage.removeItem(REPORTING_CODE_KEY);
		}
	}

	return <div>
		{reportCode && <NewReports reportCode={reportCode} setReportCode={setReportCodeHandler} />}
		{!reportCode && Object.keys(reportingData).map((reportCategory) => (
			<ReportingListItem
				key={reportCategory}
				reportCategory={reportCategory}
				reportCategoryData={reportingData[reportCategory]}
				setReportCode={setReportCodeHandler}
			/>
		))}
	</div>
}

export default ReportingLists;