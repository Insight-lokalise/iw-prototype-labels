import { isBefore, isAfter } from 'date-fns'

const dateMsg = 'This date needs to be the same as or after the '
export default function validatePreviewFields({
	approvedDate,
	closedDate,
	dealRegIdNum,
	expirationDate,
	rejectedDate,
	submittedDate
}) {
	const errors = {}
	const submitRequired = !!(dealRegIdNum || approvedDate || rejectedDate || expirationDate || closedDate)

	if (submittedDate && !dealRegIdNum) {
		errors.dealRegIdNum = 'Sorry, this field is required'
	}
	if (submitRequired && !submittedDate) {
		errors.submittedDate = 'Sorry, this field is required'
	}

	if (approvedDate) {
		let error
		if (!expirationDate) {
			error = 'Sorry, this field is required'
		} else if (submittedDate && isAfter(new Date(submittedDate), new Date(expirationDate))) {
			error = `${dateMsg} submit date`
		} else if (isAfter(new Date(approvedDate), new Date(expirationDate))) {
			error = `${dateMsg} approved adate`
		}
		errors.expirationDate = error
	}

	if (expirationDate) {
		if (!approvedDate) {
			errors.approvedDate = 'Sorry, this field is required'
		} else if (submittedDate && isAfter(new Date(submittedDate), new Date(approvedDate))) {
			errors.approvedDate = `${dateMsg} submitted date`
		}
	}

	if (rejectedDate && submittedDate) {
		if (isAfter(new Date(submittedDate), new Date(rejectedDate))) {
			errors.rejectedDate = `${dateMsg} submitted date`
		}
	}

	return errors
}
