import React from 'react'
import { useField } from '../hooks'
import FieldDecorator from './FieldDecorator'

export default function Field(props) {
    const { handleChange, initialValue, validateWith, validators, ...rest } = props
    const field = useField(props)

    return <FieldDecorator {...field} {...rest} />
}