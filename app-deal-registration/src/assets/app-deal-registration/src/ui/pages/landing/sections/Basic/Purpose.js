import React from 'react'
import PropTypes from 'prop-types'

import { Field } from '@components'
import { BASE_VALIDATORS, PURPOSE_OPTIONS } from '../../constants'

export default function Purpose({ handleChange }) {
    return (
        <div className="c-landing__section">
            <Field
                handleChange={handleChange}
                label="What would you like to do?"
                name="purpose"
                options={PURPOSE_OPTIONS}
                type="Radio"
                validators={BASE_VALIDATORS}
            />
        </div>
    )
}

Purpose.propTypes = {
    handleChange: PropTypes.func.isRequired
}