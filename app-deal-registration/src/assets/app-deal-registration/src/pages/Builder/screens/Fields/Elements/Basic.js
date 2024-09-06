import React from 'react'
import PropTypes from 'prop-types'

import { Field } from '@components'
import { isRequired } from '@lib'
import { FIELD_TYPE_OPTIONS, VALUE_FIELD_TYPES } from '@pages/Builder/constants'

const validators = [isRequired]
const dotValidator = value => {
    if (value.includes('.')) {
        return 'Sorry, this field cannot include a .'
    }
}

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY']

const displayValidators = [isRequired, dotValidator]

export default function Basic({ prefix, setFieldType, type }) {
    const handleTypeChange = ({ target: { value } }) => {
        setFieldType(prev => value)
    }

    return (
        <div className="c-builder-field__basic">
            <div className="o-grid o-grid--gutters-small">
                <Field
                    className="o-grid__item"
                    fullWidth
                    handleChange={handleTypeChange}
                    hasNoInitialSelection
                    label="Field type"
                    name={`${prefix}.type`}
                    options={FIELD_TYPE_OPTIONS}
                    type="Select"
                    unregisterOnUnmount
                    validators={validators}
                />
                <Field
                    className="o-grid__item"
                    label="Field display"
                    name={`${prefix}.display`}
                    type="Text"
                    unregisterOnUnmount
                    validators={displayValidators}
                />
                <Field
                    className="o-grid__item"
                    label="Field label"
                    name={`${prefix}.label`}
                    type="Text"
                    unregisterOnUnmount
                    validators={validators}
                />
            </div>
            <div className="o-grid o-grid--gutters-small">
                <Field
                    className="o-grid__item"
                    label="Field help text"
                    name={`${prefix}.helpText`}
                    type="Text"
                    unregisterOnUnmount
                />
                <Field
                    className="o-grid__item"
                    label="Default value"
                    name={`${prefix}.defaultValue`}
                    type="Text"
                    unregisterOnUnmount
                />
                {type === 'Select' && (
                    <Field
                        className="o-grid__item"
                        helpText="This is the text that will appear in the input field before entering a value"
                        label="Placeholder"
                        name={`${prefix}.placeholder`}
                        type="Text"
                        unregisterOnUnmount
                    />
                )}
                {type === 'Date' && (
                    <Field
                        className="o-grid__item"
                        initialValue='MM/DD/YYYY'
                        name={`${prefix}.dateFormat`}
                        label="Date Format"
                        options={dateFormats}
                        type="Select"
                        unregisterOnUnmount
                    />
                )}
            </div>
            {VALUE_FIELD_TYPES.includes(type) && (
                <div className="o-grid">
                    <Field
                        className="o-grid__item"
                        label="values"
                        name={`${prefix}.values`}
                        type="Text"
                        unregisterOnUnmount
                    />
                </div>

            )}
        </div>
    )
}
