import React, {
    createContext,
    useContext,
    useMemo,
    useState
} from 'react'

export const FieldContext = createContext(null)

export function FieldProvider({ isConditional, name, ...rest }) {
    const [fieldName, setFieldName] = useState(name)
    const [isFieldConditional, setFieldConditional] = useState(isConditional)

    const handleFieldChange = ({ target: { name, value }}) => {
        if (name === 'name') {
            return setFieldName(value)
        }
        return setFieldConditional(value === 'Yes' ? true : false)
    }

    const contextValue = useMemo(() => ({
        fieldName,
        handleFieldChange,
        isFieldConditional
    }), [fieldName, isFieldConditional])

    return <FieldContext.Provider value={contextValue} {...rest} />
}

export function useBuilderField() {
    const context = useContext(FieldContext)
    return context
}