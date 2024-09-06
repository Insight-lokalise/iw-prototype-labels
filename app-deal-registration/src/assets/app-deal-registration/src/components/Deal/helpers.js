import { convertLegacyFields, convertDealStructure, convertToSubmitStructure } from '@services/builder'

export function getFieldsForDeal(passedFields) {
    const fieldsToPass = passedFields.formFields ? passedFields.formFields : passedFields
    const convertedFields = fieldsToPass.isModern
        ? fieldsToPass
        : convertToSubmitStructure(convertLegacyFields({ formFields: fieldsToPass }))
    return convertDealStructure(convertedFields)
}