export default function generateFormPayload(isEdit, queueStatus, { builder, purpose }) {
	const { form, groups, inputs, universal } = builder
	const { selectedForm, selectedCountry, selectedManufacturer, selectedProgram } = purpose
	const payload = {
		formFields: {
			custom: {
				childLayouts: groups.childLayouts,
				groups: groups.groups,
				inputs: inputs.inputs
			},
			universal,
			queueStatus
		},
		manufacturer: selectedManufacturer.manufacturer,
		program: selectedProgram,
		salesAreaId: selectedCountry.salesAreaId
	}

	if (isEdit) {
		payload.createDate = form.createDate
		payload.formId = form.formId
		payload.modifiedDate = new Date(Date.now())
		payload.versionId = selectedForm.nextVersion
	}

	return payload
}
