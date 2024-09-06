export const DEFAULT_INPUT_HEIGHTS = {
    Checkbox: 1,
    Date: 2,
    File: 4,
    ListBox: 3,
    Number: 1,
    Radio: 2,
    Select: 1,
    Text: 1,
    TextArea: 3
}

export const FIELD_TYPE_OPTIONS = [
    // 'Checkbox', Disabled pending possible feature update
    'Date',
    { optionValue: 'Select', text: 'Dropdown' },
    'ListBox',
    'Number',
    'Radio',
    'Text',
    'TextArea'
]

export const VALUE_FIELD_TYPES = [
    // 'Checkbox', Disabled pending possible feature update
    'ListBox',
    'Radio',
    'Select'
]