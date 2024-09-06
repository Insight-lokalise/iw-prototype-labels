import React from 'react'
import { formatDate } from 'lib'

const columnSet = [
	['Deal Id', 'dealId'],
	['Legacy Id', 'legacyId'],
	['Manufacturer', 'manufacturer'],
	['Program', 'program'],
	['Revenue', 'revenue'],
	['Rep Name', 'repName'],
	['Sold To', 'soldTo'],
	['Sold to name', 'soldToName'],
	['Sold to country', 'soldToCountry'],
	['Opportunity Id', 'opportunityId'],
	['Created', 'created'],
	['Modified', 'modified'],
	['Preview', 'preview'],
	['Edit', 'edit'],
	['Alt ID', 'alternateDealRegNum'],
]
const dateFormat = 'DD/MMM/YYYY [at] h:mma'

export const tableColumns = columnSet.map(([Header, accessor]) => ({
	accessor,
	Cell: row => <span className='c-admin-table__cell'>{row.value}</span>,
	download: !(accessor === 'preview' || accessor === 'edit'),
	Header: () => <span className='c-admin-table__header'>{Header}</span>,
	text: Header,
}))

export function generateTableDataFromDeal(deal) {
	const { universal } = deal.formFields
	if (
		!universal.accountInfo ||
		!universal.misc ||
		!universal.repInfo ||
		!deal.id
	) {
		return
	}

	const { accountInfo, misc, repInfo } = universal
	// eslint-disable-next-line consistent-return
	return {
		'Deal Id': deal.id,
		'Legacy Id': deal.legacy_id,
		Manufacturer: deal.manufacturer,
		Program: deal.program,
		Revenue: misc.opptyRevAmt,
		'Rep Name': repInfo.repName,
		'Sold To': accountInfo.accountNumber,
		'Sold To Name': accountInfo.accountName,
		'Sold To Country': accountInfo.accountCountry,
		'Opportunity Id': deal.opportunityId,
		Created: formatDate(deal.createDate, dateFormat),
		Modified: formatDate(deal.modifiedDate, dateFormat),
		'Alternate Id': deal.alternateDealRegNum,
	}
}

export function generateDataFromDeal(deal) {
	const { universal } = deal.formFields
	if (
		!universal.accountInfo ||
		!universal.misc ||
		!universal.repInfo ||
		!deal.id
	) {
		return
	}

	const { accountInfo, misc, repInfo } = universal
	// eslint-disable-next-line consistent-return
	return {
		dealId: deal.id,
		legacyId: deal.legacy_id,
		manufacturer: deal.manufacturer,
		opportunityId: deal.opportunityId,
		program: deal.program,
		revenue: misc.opptyRevAmt,
		repName: repInfo.repName,
		soldTo: accountInfo.accountNumber,
		soldToName: accountInfo.accountName,
		soldToCountry: accountInfo.accountCountry,
		created: formatDate(deal.createDate, dateFormat),
		modified: formatDate(deal.modifiedDate, dateFormat),
		alternateDealRegNum: deal.alternateDealRegNum,
		preview: '',
		edit: '',
	}
}
