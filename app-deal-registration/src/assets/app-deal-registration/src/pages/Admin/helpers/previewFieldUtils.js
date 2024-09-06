import { formatDate } from 'lib';
import { isAfter } from 'date-fns';
import { DATE_FORMATS } from "../constants";
import { FIELD_LIST } from './previewFieldConstants';

const {
	DEAL_REG_ID_NUM,
	SUBMITTED_DATE,
	APPROVED_DATE,
} = FIELD_LIST;
const getDateFromProps = (dateValue) => dateValue ? formatDate(dateValue, DATE_FORMATS.MM_DD_YYYY) : '';
export const checkIsAfterDate = (compareDate, value) => compareDate && isAfter(new Date(compareDate), new Date(value));

export const getDefaultState = props => ({
	alternateDealRegNum: props.alternateDealRegNum || '',
	approvedDate: getDateFromProps(props.approvedDate),
	botnotes: props.botnotes || '',
	closedDate: getDateFromProps(props.closedDate),
	dealRegIdNum: props.dealRegIdNum || '',
	expirationDate: getDateFromProps(props.expirationDate),
	lastModifiedBy: (props.currentUser && props.currentUser.name) || '',
	lastModifiedByEmplId:
		(props.currentUser && props.currentUser.employeeID) || '',
	errors: {},
	errorMessage: null,
	notes: props.notes || '',
	rejectedDate: getDateFromProps(props.rejectedDate),
	submittedDate: getDateFromProps(props.submittedDate),
	approvalStatus: props.approvalStatus || '',
	deniedReasonCode: props.deniedReasonCode || 0,
})


export const isFieldRequired = (fieldName, state) => {
	let required = false;
	const {
		approvedDate,
		dealRegIdNum,
		expirationDate,
		rejectedDate,
		submittedDate,
	} = state;

	const submittedRequired = !!(
		dealRegIdNum ||
		approvedDate ||
		rejectedDate ||
		expirationDate 
	);

	if (fieldName === DEAL_REG_ID_NUM.name && !!submittedDate) {
		required = true;
	} else if (fieldName === SUBMITTED_DATE.name && submittedRequired) {
		required = true;
	} else if (fieldName === APPROVED_DATE.name && !!expirationDate) {
		required = true;
	}
	return required;
}