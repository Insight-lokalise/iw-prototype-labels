import { BOOLEAN_MAP } from '../constants'

const formatString = str => (typeof str === 'string' ? str : str.toString())
    .toLowerCase()
    .trim()

export default function parseConditionalValues({ is, when }, values) {
    if (!values || !values[when]) {
        return false
    }

    const entries = is.split(',')
    const value = Array.isArray(values[when])
        ? values[when].map(formatString)
        : formatString(values[when])
    
    return entries.some(passingValue => {
        let formatted = formatString(passingValue)
        const isNegated = formatted.startsWith('!')
        if (isNegated) {
            formatted = formatted.split('!')[1]
        }

        if (BOOLEAN_MAP.includes(formatted)) {
            const passedValue = formatted === 'true' ? true : false
            if (Array.isArray(value)) {
                return isNegated ? !value.includes(passedValue) : value.includes(passedValue)
            }
            return isNegated ? value !== passedValue : value === passedValue
        }

        if (Array.isArray(value)) {
            return isNegated ? !value.includes(formatted) : value.includes(formatted)
        }

        console.log('value', value)
        console.log('formatted', formatted)
        
        if (isNegated) {
            return value !== formatted
        }
        return value == formatted
    })
}