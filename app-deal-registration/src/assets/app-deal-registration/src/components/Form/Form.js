import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FormContext } from './context'
import { useForm } from './hooks'

export default function Form({
    children,
    formRef,
    handleSubmit,
    initialErrors,
    initialValues,
    validateOnBlur,
    validateOnChange,
    ...rest
}) {
    const form = useForm({ handleSubmit, initialErrors, initialValues, validateOnBlur, validateOnChange })
    const contextValue = useMemo(() => form, [])

    if (formRef) {
        formRef(form)
    }

    // Refactor this to a renderEl function later when time permits
    let childProp = null
    if (typeof children === 'function') {
        childProp = children({ ...form, ...rest})
    } else if (children) {
        childProp = children
    }
    return (
        <form className="c-form" onSubmit={form.onSubmit}>
            <FormContext.Provider value={contextValue} {...rest}>
                {childProp}
            </FormContext.Provider>
        </form>
    )
}