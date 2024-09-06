import { SALES_ORG_TO_ID_MAP } from 'constants'

const checkAdminFields = ({ selectedForm }) => ({
	approvalStatus: selectedForm.approvalStatus || null,
	approvedDate: selectedForm.approvedDate || null,
	botnotes: selectedForm.botnotes || null,
	createdBy: selectedForm.createdBy || null,
	closedDate: selectedForm.closedDate || null,
	modifiedDate: new Date(Date.now()),
	notes: selectedForm.notes || null,
	rejectedDate: selectedForm.rejectedDate || null,
	submittedDate: selectedForm.submittedDate || null
})

export default function createSubmissionArgs({ purpose, values }, salesOrgId) {
  const { currentUser, selectedDeal } = purpose
	const { custom, universal, fileAttachments } = values
	const { id, form_id, form_version, fromFields, queueStatus, ...adminFields } = selectedDeal
	const passedAdminFields = { ...adminFields, modifiedDate: new Date(Date.now()) }
	const employeeID = currentUser.employeeID || ''
	const userName = currentUser.name || ''

	return {
		...passedAdminFields,
		formFields: { custom, universal, fileAttachments },
		form_id,
		form_version,
		id,
		queueStatus,
		lastModifiedBy: userName,
		lastModifiedByEmplId: employeeID,
		salesAreaId: salesOrgId
	}
}
