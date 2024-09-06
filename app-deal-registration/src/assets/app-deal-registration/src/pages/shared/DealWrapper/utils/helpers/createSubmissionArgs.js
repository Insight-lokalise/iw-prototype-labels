const defaultArgs = {
	approvalStatus: null,
	approvedDate: null,
	botnotes: null,
	closedDate: null,
	notes: null,
	rejectedDate: null,
	submittedDate: null
}

export default function createSubmissionArgs(props, formData) {
	const { isEdit, purpose } = props
	const { formId, queueStatus = 'NEW', versionId } = purpose.selectedForm
	const { custom, universal, ...rest } = formData

}
