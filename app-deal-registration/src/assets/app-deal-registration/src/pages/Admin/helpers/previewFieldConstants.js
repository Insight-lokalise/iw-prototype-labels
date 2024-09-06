import { dateFieldsFormatted } from 'lib';
import { isAfter, startOfDay } from 'date-fns';
import { checkIsAfterDate } from './previewFieldUtils';

const SAME_OR_AFTER_TEXT = 'This date needs to be the same as or after';
const FIELD_VALIDATIONS = {
	dealRegIdNum: (value, state) => {
		const { submittedDate } = state;
		if (submittedDate && !value) {
			return ERROR_TEXTS.REQUIRED;
		}
	},
	submittedDate: (value, state) => {
		const {
			approvedDate,
			dealRegIdNum,
			expirationDate,
			rejectedDate,
		} = state;
		const submittedRequired = !!(
			dealRegIdNum ||
			approvedDate ||
			rejectedDate ||
			expirationDate 
		);

		const newValue = value && value.trim();
		if(newValue || submittedRequired) {
			if (submittedRequired && !newValue) {
				return ERROR_TEXTS.REQUIRED;
			}
			if (!dateFieldsFormatted(newValue) || isNaN(Date.parse(newValue))) {
				return ERROR_TEXTS.INVALID_DATE_FORMAT;
			}
		}
	},
	expirationDate: (value, state) => {
		const { submittedDate, approvedDate } = state;
		const newValue = value && value.trim();
		if(newValue) {
			if (!dateFieldsFormatted(newValue) || isNaN(Date.parse(newValue))) {
				return ERROR_TEXTS.INVALID_DATE_FORMAT;
			}
			if (checkIsAfterDate(submittedDate, newValue)) {
				return ERROR_TEXTS.SAME_OR_AFTER_SUBMIT_DATE;
			}
			if (checkIsAfterDate(approvedDate, newValue)) {
				return ERROR_TEXTS.SAME_OR_AFTER_APPROVED_DATE
			}
		}
	},
	closedDate: (value, state) => {
		const { submittedDate, approvedDate } = state;
		const newValue = value && value.trim();
		if(newValue) {
			if (!dateFieldsFormatted(newValue) || isNaN(Date.parse(newValue))) {
				return ERROR_TEXTS.INVALID_DATE_FORMAT;
			}
			if (checkIsAfterDate(submittedDate, newValue)) {
				return ERROR_TEXTS.SAME_OR_AFTER_SUBMIT_DATE;
			}
			if (checkIsAfterDate(approvedDate, newValue)) {
				return ERROR_TEXTS.SAME_OR_AFTER_APPROVED_DATE;
			}
		}
	},
	approvedDate: (value, state) => {
		const { submittedDate, expirationDate } = state;
		const newValue = value && value.trim();
		if(newValue || expirationDate) {
			if (expirationDate && !newValue) {
				return ERROR_TEXTS.REQUIRED;
			}
			if (!dateFieldsFormatted(newValue) || isNaN(Date.parse(newValue))) {
				return ERROR_TEXTS.INVALID_DATE_FORMAT;
			}
			if (checkIsAfterDate(submittedDate, newValue)) {
				return ERROR_TEXTS.SAME_OR_AFTER_SUBMIT_DATE;
			}
		}
	},
	rejectedDate: (value, state) => {
		const { submittedDate } = state;
		const newValue = value && value.trim();
		if(newValue) {
			if (!dateFieldsFormatted(newValue) || isNaN(Date.parse(newValue))) {
				return ERROR_TEXTS.INVALID_DATE_FORMAT;
			}
			if (checkIsAfterDate(submittedDate, newValue)) {
				return ERROR_TEXTS.SAME_OR_AFTER_SUBMIT_DATE;
			}
		}
	}
}

export const ERROR_TEXTS = {
	REQUIRED: 'This field is required',
	INVALID_DATE_FORMAT: 'Invalid date format. Please adhere to MM/DD/YYYY',
	SAME_OR_AFTER_SUBMIT_DATE: `${SAME_OR_AFTER_TEXT} the submit date`,
	SAME_OR_AFTER_APPROVED_DATE: `${SAME_OR_AFTER_TEXT} the approved date`,
	SAME_OR_AFTER_TODAY: `${SAME_OR_AFTER_TEXT} today`,
	PROVIDE_VALID_VALUES: 'Please provide valid values for the fields.'
}

export const FIELD_LIST = {
	DEAL_REG_ID_NUM: {
		fieldComponent: 'Text',
		label: 'Deal reg id (partner)',
		name: 'dealRegIdNum',
		validate: FIELD_VALIDATIONS.dealRegIdNum,
	},
	ALTERNATE_DEAL_REG_NUM: {
		fieldComponent: 'Text',
		label: 'Alternate id',
		name: 'alternateDealRegNum'
	},
	SUBMITTED_DATE: {
		fieldComponent: 'Date',
		label: 'Submitted date',
		name: 'submittedDate',
		validate: FIELD_VALIDATIONS.submittedDate,
	},
	EXPIRATION_DATE:{
		fieldComponent: 'Date',
		label: 'Expiration date',
		name: 'expirationDate',
		validate: FIELD_VALIDATIONS.expirationDate,
	},
	CLOSED_DATE: {
		fieldComponent: 'Date',
		label: 'Closed date',
		name: 'closedDate',
		validate: FIELD_VALIDATIONS.closedDate,
	},
	APPROVED_DATE: {
		fieldComponent: 'Date',
		label: 'Approved date',
		name: 'approvedDate',
		validate: FIELD_VALIDATIONS.approvedDate,
	},
	REJECTED_DATE: {
		fieldComponent: 'Date',
		label: 'Rejected date',
		name: 'rejectedDate',
		validate: FIELD_VALIDATIONS.rejectedDate,
	},
	APPROVAL_STATUS: {
		fieldComponent: "Dropdown",
		label: "Completion Status",
		name: "approvalStatus"
	},
	DENIED_REASON_CODE: {
		fieldComponent: "Dropdown",
		label: "Denied Reason",
		name: "deniedReasonCode"
	},
	BOTNOTES: {
		fieldComponent: 'TextArea',
		label: 'Bot notes',
		name: 'botnotes'
	},
	NOTES: {
		fieldComponent: 'TextArea',
		label: 'Notes',
		name: 'notes'
	}
}
