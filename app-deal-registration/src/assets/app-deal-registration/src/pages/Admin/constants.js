import { SALES_ORG_TO_ID_MAP, SALES_ORGS } from 'constants'

export const INITIAL_SEARCH_STATE = {
	alternateDealRegNum: '',
	dateField: '',
	dealId: '',
	dealNum: '',
	endDate: '',
	isSearching: false,
	opportunityId: '',
	salesAreaId: '',
	searchFieldName: '',
	searchFieldValue: '',
	startDate: '',
}

const DATE_TYPES = [
	['Approved date', 'approvedDate'],
	['Closed date', 'closedDate'],
	['Create date', 'createDate'],
	['Expiration date', 'expirationDate'],
	['Modified date', 'modifiedDate'],
	['Rejected date', 'rejectedDate'],
	['Submitted date', 'submittedDate'],
]

const SEARCH_TYPES = [
	['Deal ID', 'dealId'],
	['Deal Num', 'dealNum'],
	['Sold to name', 'soldToName'],
	['Manufacturer', 'manufacturer'],
	['Deal ID and num', 'dealIdAndNum'],
	['Sold to num', 'soldToNumber'],
  ['Alternate Deal ID', 'alternateDealRegNum'],
  ['Opportunity ID', 'opportunityId']
]

export const DATE_TYPES_MAP = DATE_TYPES.map((field) => field[1])

export const COUNTRY_TYPE_OPTIONS = SALES_ORGS.map(type => ({
	optionValue: SALES_ORG_TO_ID_MAP[type],
	text: type
}))

export const DATE_TYPE_OPTIONS = DATE_TYPES.map(([text, optionValue]) => ({
	text,
	optionValue
}))

export const SEARCH_TYPE_OPTIONS = [...SEARCH_TYPES, ...DATE_TYPES].map(
	([text, optionValue]) => ({ text, optionValue })
)

export const DATE_FORMATTER = 'YYYY-MM-DDThh:mm:ss'

export const DATE_FORMATS = {
	MM_DD_YYYY: 'MM/DD/YYYY'
}

export const DEAL_FIELDS = ['dealId', 'dealNum', 'dealIdAndNum', 'alternateDealRegNum', 'opportunityId']

export const DEAL_FIELDS_MAP = DEAL_FIELDS.reduce((acc, field) =>{
  return { ...acc, [field]: field }
}, {})

export const DATE_FIELDS = ['endDate', 'startDate']

export const SOLD_TO_FIELDS = ['soldToName', 'soldToNumber']

export const COMPLETION_STATUS_OPTIONS = ['', 'Pending','Approved','Denied']