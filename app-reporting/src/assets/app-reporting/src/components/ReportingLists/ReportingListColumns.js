import React from "react";
import { Accordion } from '@insight/toolkit-react';

const findMidIndex = (length) => Math.floor((length % 2 === 0) ? (length / 2) : ((length / 2) + 1));

export const ReportingListColumns = ({ reportList }) => {
	const reportingListLength = reportList.length;
	if (reportingListLength === 0) {
		return null;
	}

	const midIndex = findMidIndex(reportingListLength);
	const firstColumnList = reportList.slice(0, midIndex);
	const secondColumnList = reportList.slice(midIndex, reportingListLength);

	const renderLists = (list) => {
		return (
			<div className="o-grid__item u-1/1 u-1/2@tablet c-reporting__list-column">
				<Accordion allowMultiple items={list} autoScroll={false} />
			</div>
		)
	};

	return (
		<div className="o-grid">
			{renderLists(firstColumnList)}
			{renderLists(secondColumnList)}
		</div>
	);
}

export default ReportingListColumns;