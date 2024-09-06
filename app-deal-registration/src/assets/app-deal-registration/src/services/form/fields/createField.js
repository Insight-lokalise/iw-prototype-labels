import { applyAdapter } from '../adapters'
import { 
    transformConditionals,
    transformOptions,
    transformSets,
    transformValidators
} from '../transforms'

const createBaseField = ({ conditionalGroups, validators, ...rest }) => rest

export default function createField(input, context, adapterType) {
    const currentSet = input.isConditional && input.isConditional !== 'No' ? transformSets(input.sets, context.values) : input.sets[0]
    if (currentSet === 'no-matching-set') {
        return { hidden: true }
    }

    const { conditionalGroups, ...rest } = currentSet
    const baseField = { ...rest, id: input.id, name: input.name }
    let field = applyAdapter(baseField, context, adapterType)

    if (field.values && field.values.length > 0) {
        field = { ...field, ...transformOptions(field) }
    }

    if (conditionalGroups && conditionalGroups.length > 0 && conditionalGroups[0].conditionals && conditionalGroups[0].conditionals[0].when) {
        field.visible = transformConditionals(conditionalGroups, context.values)
    } else {
        field.visible = true
    }


    const hasValidators = field.validators && field.validators.length > 0 && field.validators[0].type
    if (hasValidators) {
        // Use different validator for European date formats
        if (field.type === 'Date' && field.dateFormat === 'DD/MM/YYYY') {
          field.validators = field.validators.map(c => {return c.type === 'asOf' ? {type: 'asOfDDMMYYYY'} : c})
        }
        const { required, validators } = transformValidators(field, context.values)
        field.required = required
        field.validators = validators
    } else {
        field.validators = []
    }

    if (field.type === 'Dropdown' || field.type === 'Select') {
        field.fullWidth = true
    }

    
    return field
}
