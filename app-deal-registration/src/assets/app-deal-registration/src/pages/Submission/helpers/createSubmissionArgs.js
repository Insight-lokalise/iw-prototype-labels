const defaultArgs = {
	approvalStatus: null,
	approvedDate: null,
	botnotes: null,
	closedDate: null,
	modifiedDate: null,
	notes: null,
	rejectedDate: null,
	submittedDate: null
}

export default function createSubmissionArgs(purpose, formData, entryContext, salesOrgId) {
	const { currentUser, selectedForm } = purpose
	const { formFields: { queueStatus }, formId, manufacturer, program, versionId } = selectedForm
	const employeeID = currentUser && currentUser.employeeID || ''
	const name = currentUser && currentUser.name || ''

	const { custom, universal, fileAttachments, ...rest } = formData
	const { entrypoint, pathArgs } = entryContext
  const fromClientlink = entrypoint === 'clientlink'

	return {
		...defaultArgs,
		...rest,
		manufacturer,
		program,
		createdBy: name,
    	createdByEmplId: employeeID,
		form_id: formId,
		form_version: versionId,
		formFields: { custom, universal, fileAttachments},
		lastModifiedBy: name,
    	lastModifiedByEmplId: employeeID,
    	...(fromClientlink && getClientlinkArgs(pathArgs)),
		queueStatus,
		salesAreaId: salesOrgId
	}
}

function getClientlinkArgs(args) {
  const { lineItem, opportunityId } = args
  return { lineItemId: parseInt(lineItem), opportunityId }
}
