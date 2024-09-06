const COMMON_VALIDATORS = [
    { optionValue: 'conditionalRequired', text: 'Conditional required' },
    'required'
]

const DATE_VALIDATOR_TYPES = [
    ...COMMON_VALIDATORS,
    { optionValue: 'afterDate', text: 'After date' },
    { optionValue: 'asOf', text: 'As of today' },
    { optionValue: 'beforeDate', text: 'Before date' }
]

const NUMBER_VALIDATOR_TYPES = [
    ...COMMON_VALIDATORS,
    { optionValue: 'greaterThan', text: 'Greater than' },
    { optionValue: 'lessThan', text: 'Less than' }
]

const TEXT_VALIDATOR_TYPES = [
    ...COMMON_VALIDATORS, 
    'email',
    { optionValue: 'maxLength', text: 'Max length' },
    { optionValue: 'minLength', text: 'Min length' },
    'phone', 
    'website'
]

export const ALLOWED_VALIDATORS_FOR_TYPE = {
    'Checkbox': COMMON_VALIDATORS,
    'Date': DATE_VALIDATOR_TYPES,
    'ListBox': COMMON_VALIDATORS, 
    'Number': NUMBER_VALIDATOR_TYPES,
    'Radio': COMMON_VALIDATORS,
    'Select': COMMON_VALIDATORS,
    'Text': TEXT_VALIDATOR_TYPES,
    'TextArea': TEXT_VALIDATOR_TYPES
}

export const VALUE_VALIDATOR_TYPES = [
    'greaterThan',
    'lessThan',
    'maxLength',
    'minLength',
    'afterDate',
    'beforeDate'
]