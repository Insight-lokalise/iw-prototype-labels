import { useRef } from 'react'
import { getDeep, setDeep} from '@lib'

export default function useForm({
    initialErrors = {},
    initialValues = {},
    handleSubmit,
    validateOnChange = true,
    validateOnBlur = false
}) {
    const initialErrorsRef = useRef(initialErrors)
    const initialValuesRef = useRef(initialValues)
    const currentValuesRef = useRef(initialValues)

    const fields = useRef({})
    const validateWithRef = useRef({})

    function registerField(name, field) {
        if (!fields.current[name]) {
            fields.current[name] = field
            if (field.validateWith.length > 0) {
                validateWithRef.current[name] = [name, ...field.validateWith]
            }
        }
    }

    function unregisterField(name, removeValueOnUnmount) {
        delete fields.current[name]
        if (validateWithRef.current[name]) {
            delete validateWithRef.current[name]
        }
        if (removeValueOnUnmount) {
            currentValuesRef.current = setDeep(currentValuesRef.current, name, '', true) || {}
        }
    }

    function getInitialValue(name) {
        return getDeep(initialValuesRef.current, name)
    }

    function getInitialValues() {
        return Object.keys(initialValuesRef.current).reduce((acc, key) => {
            acc[key] = initialValuesRef.current[key]
            return acc
        }, {})
    }

    function getInitialErrors(name) {
        return initialErrorsRef.current[name] || []
    }
    
    function getFormValues(names = [], mountedOnly = false) {
        const passedNames = names.length > 1 ? names : Object.keys(fields.current)
        return passedNames.reduce((acc, name) => {
            const value = mountedOnly ? fields.current[name].getValue() : getDeep(currentValuesRef.current, name)
            acc = setDeep(acc, name, value)
            return acc
        }, {})
    }

    function getInternalFormValues() {
        return Object.keys(currentValuesRef.current).reduce((acc, key) => {
            acc[key] = currentValuesRef.current[key]
            return acc
        }, {})
    }

    function validateSingleField(name, value, changePristine = false) {
        return fields.current[name].validate(value, name, changePristine)
    }

    function validateField(name, value) {
        if (validateWithRef.current[name]) {
            const names = validateWithRef.current[name]
            const values = getFormValues(names, true)
            return names.map(name => validateSingleField(name, value))
        }
        return validateSingleField(name, value)
    }

    function validateAll(onlyMounted = false) {
        const names = Object.keys(fields.current)
        const values = getFormValues(names, onlyMounted)
        
        let hasErrors = false

        const errors = names.reduce((acc, name) => {
            const field = fields.current[name]
            if (!field || field.getMountStatus() !== true) {
                return acc
            }
            const passedValue = validateWithRef.current[name] ? values : getDeep(values, name)
            const error = validateSingleField(name, passedValue, true)
            if (error && error.length > 0) {
                acc[name] = error
                hasErrors = true
            }
            return acc
        }, {})
        return !hasErrors
    }

    function changeValue(state, name, mutate) {
        const before = getDeep(state.current, name)
        const after = mutate(before)
        state.current = setDeep(state.current, name, after) || {}
    }

    function setFieldValues(newValues) {
        Object.keys(newValues).forEach(valueKey => {
            changeValue(currentValuesRef, name, () => newValues[valueKey])
        })
    }

    function updateFields(newValues) {
        Object.keys(newValues).forEach(valueKey => {
            const field = fields.current[valueKey]
            if(field === undefined) return // if there is no form field for the json field then ignore it
            changeValue(currentValuesRef, valueKey, () => newValues[valueKey])
            field.setValue(newValues[valueKey])
            field.validate(valueKey, newValues[valueKey])
        })
    }

    function handleChange({ target: { name, value }}) {
        changeValue(currentValuesRef, name, () => value)
    }

    async function onSubmit() {
        const values = getFormValues()
        const isValid = validateAll()
        await handleSubmit(values, isValid)
    }

    function removeArrayValue(name, index) {
        currentValuesRef.current[name].splice(index, 1)
    }

    function resetFields(removeKeys = []) {
        const initialValues = getInitialValues();
        let filteredValues = {};
        for(const key in initialValues) {
            if(!removeKeys.includes(key)) {
                filteredValues[key] = initialValues[key];
            }
        }
        updateFields(filteredValues);
    }

    return {
        getFormValues,
        getInitialErrors,
        getInitialValue,
        getInitialValues,
        getInternalFormValues,
        handleChange,
        onSubmit,
        registerField,
        removeArrayValue,
        setFieldValues,
        unregisterField,
        updateFields,
        validateAll,
        validateField,
        validateOnBlur,
        validateOnChange,
        resetFields
    }
}
