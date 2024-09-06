export default function getDefaultPreviewState(props) {
	return {
		approvedDate: props.approvedDate || '',
		botnotes: props.botnotes || '',
		closedDate: props.closedDate || '',
		dealRegIdNum: props.dealRegIdNum || '',
		expirationDate: props.expirationDate || '',
		errors: {},
		notes: props.notes || '',
		rejectedDate: props.rejectedDate || '',
		submittedDate: props.submittedDate || ''
	}
}
