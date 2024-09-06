import convertCustomFields from './convertCustomFields'
import convertUniversalFields from './convertUniversalFields'

export default function convertLegacyFields(passedFields) {
    const { formFields: { custom, universal, ...otherFields }} = passedFields
    const customFields = convertCustomFields(custom)
    const universalFields = convertUniversalFields(universal)

    passedFields.formFields = {
        ...otherFields,
        custom: customFields,
        isModern: true,
        universal: universalFields
    }

    return passedFields
}