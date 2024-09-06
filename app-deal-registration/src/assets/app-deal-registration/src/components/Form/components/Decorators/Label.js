import React from 'react'
import PropTypes from 'prop-types'

export default function Label({ children, id, required, ...rest }) {
    return (
        <label className="c-form__label" htmlFor={id} {...rest}>
            {children}
            {required && <abbr className="c-form__required" title="required">*</abbr>}
        </label>
    )
}

Label.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    required: PropTypes.bool
}