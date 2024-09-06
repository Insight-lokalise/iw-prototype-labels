export function parseSubmissionArgs({ isEdit, passedValues, purposeState }) {
    const { selectedCountry: { salesAreaId }, selectedForm, selectedManufacturer: { manufacturer }, selectedProgram: program } = purposeState

    const payload = {
        createDate: new Date(Date.now()),
        manufacturer,
        program,
        salesAreaId,
        formFields: { ...passedValues, isModern: true },
        versionId: 1
    }

    if (isEdit) {
        payload.formId = selectedForm.formId
        payload.modifiedDate = new Date(Date.now())
        payload.versionId = selectedForm.nextVersion
    }

    return payload
}