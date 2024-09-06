import { useEffect, useRef, useState } from 'react'
import { useFormContext } from '../context'

export default function useField({
    format,
    handleBlur,
    handleChange,
    initialErrors = [],
    initialValue = '',
    name,
    removeValueOnUnmount = false,
    type,
    unregisterOnUnmount = false,
    validateOnBlur = false,
    validateOnChange = true,
    validateWith = [],
    validators = []
}) {
    const form = useFormContext()
    const [errors, setErrors] = useState(() => {
        if (form) {
            return form.getInitialErrors(name)
        }
        return initialErrors
    })
    const [pristine, setPristine] = useState(true)
    const [touched, setTouched] = useState(false)
    const [validating, setValidating] = useState(false)
    const [value, setValue] = useState(() => {
        if (form && !initialValue) {
            return form.getInitialValue(name)
        }
        return initialValue
    })

    const isMounted = useRef(false)
    const getMountStatus = () => isMounted.current

    function getValue() {
        return value
    }

    function validate(value, passedName, changePristine) {
        if (!validators.length > 0) {
            return
        }
        if (isMounted.current) {
            setValidating(true)
            if (changePristine) {
                setPristine(prev => false)
            }
        }
        
        const errors = validators.map(validator => validator(value, name)).filter(Boolean)
        setErrors(prev => errors)
        setValidating(false)
        return errors
    }

    useEffect(() => {
        isMounted.current = true
        if (form) {
            try{
                form.registerField(name, { getMountStatus, getValue, setValue, validate, validateWith })
                form.validateField(name, value)
            } catch(e){
                console.warn("Error while registering/validating form fields : ", e);
            }
        }
        
        return () => {
            console.log('should unregister', name)
            isMounted.current = false
            if (form && unregisterOnUnmount) {
                console.log('definitely should unregistry')
                form.unregisterField(name, removeValueOnUnmount)
            }
        }
    }, [])

    function onBlur(e) {
        if (!touched) {
            setTouched(true)
        }

        const passedValue = format ? format(e.target.value) : e.target.value
        const modifiedEvent = format ? { ...e, target: { ...e.target, value: passedValue }} : e

        if (form) {
            // Allow local value to override form
            // call form.handleBlur
            if (form) {
                form.handleChange(modifiedEvent)
            }
            if (form.validateOnBlur || validateOnBlur) {
                form.validateField(name, passedValue)
            }
        } else if (validateOnBlur) {
            validate(passedValue)
        }

        handleBlur && handleBlur(modifiedEvent)
    }

    function onChange(e) {
        if (pristine) {
            setPristine(false)
        }

        const valueToSet = type === 'Checkbox'
            ? e.target.checked
            : e.target.value

        if (form) {
            form.handleChange(e)
            if (form.validateOnChange || validateOnChange) {
                form.validateField(name, valueToSet)
            }
        }
        
        setValue(valueToSet)
        if (!form && validateOnChange) {
            validate(e.target.value)
        }

        handleChange && handleChange(e)
    }

    return {
        errors,
        name,
        onBlur,
        onChange,
        pristine,
        touched,
        validating,
        value
    }
}