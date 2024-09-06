import React from 'react'
import PropTypes from 'prop-types'

export default function HelpText({ children, ...rest }) {
    return (
        <small className="c-form__help" {...rest}>
            {children}
        </small>
    )
}

HelpText.propTypes = {
    children: PropTypes.node
}