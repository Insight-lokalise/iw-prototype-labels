import { useRef } from 'react'


export default function useFields(isEdit) {
    const fields = useRef({})

    const registerField = (id, field) => {
        if (!fields.current[id]) {
            fields.current[id] = field
        }
        return () => {
            delete fields.current[id]
        }
    }

    const removeField = id => {
        delete fields.current[id]
    }

    const getFieldValues = () => {
        return Object.keys(fields.current).reduce((acc, key) => {
            acc[key] = { ...fields.current[key].getInternalFormValues(), id: key }
            return acc
        }, {})
    }
    
    const validateFields = () => Object.keys(fields.current).reduce((acc, key) => {
        const isValid = fields.current[key].validateAll()
        if (!isValid) {
            acc[key] = true
        }
        return acc
    }, {})

    return {
        getFieldValues,
        registerField,
        removeField,
        validateFields
    }
}
