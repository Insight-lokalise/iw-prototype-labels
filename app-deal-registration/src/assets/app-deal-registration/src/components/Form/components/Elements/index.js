import { DateField } from './Date'
import { File } from './File'
import { Listbox } from './Listbox'
import { NumberField } from './Number'
import { RadioGroup } from './Radio'
import { Checkbox, Select } from './Select'
import { Text, TextArea } from './Text'

export const COMPONENT_MAP = {
    Checkbox,
    Date: DateField,
    Dropdown: Select,
    File,
    Listbox,
    ListBox: Listbox,
    'Number': NumberField,
    Radio: RadioGroup,
    Select,
    Text,
    TextArea
}
