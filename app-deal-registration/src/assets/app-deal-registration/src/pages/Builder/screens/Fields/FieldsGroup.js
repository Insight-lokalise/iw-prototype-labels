import React from 'react'
import PropTypes from 'prop-types'

import { Field } from '@components'
import { isRequired } from '@lib'
import { useBuilderContext } from '../../context'
import { StylePicker } from './Styles'

const validators = [isRequired]

export default function FieldsGroup({ header, id, name }) {
    const { dispatcher } = useBuilderContext()
    const handleChange = ({ target: { name: passedName, value }}) => {
        dispatcher.updateGroup({ id, name: passedName, value })
    }

    return (
        <div className="c-builder-fields__group">
            <StylePicker dispatcher={dispatcher} id={id} type="group" />
            <Field
                handleChange={handleChange}
                initialValue={name}
                name="name"
                label="Group name"
                type="Text"
                unregisterOnUnmount
                validators={validators}
            />
            <Field
                handleChange={handleChange}
                initialValue={header}
                label="Group header"
                name="header"
                type="TextArea"
            />  
        </div>
    )
}