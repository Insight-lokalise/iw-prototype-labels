const formatString = str => str.split(' ').join('-').trim()

export default function getFormName({ selectedCountry, selectedForm, selectedManufacturer, selectedProgram }, isEdit) {
    const { salesAreaId } = selectedCountry
    const manufacturer = formatString(selectedManufacturer.manufacturer)
    const program = formatString(selectedProgram)
    const base = `${salesAreaId}-${manufacturer}-${program}`
    
    if (isEdit) {
        const { formId, versionId } = selectedForm
        return `${base}-${formId}-${versionId}`
    }
    return base
}