import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Country from './Country'
import Purpose from './Purpose'

export default function Basic({ handleChange }) {
    return (
        <Fragment>
            <Purpose handleChange={handleChange} />
            <Country handleChange={handleChange} />
        </Fragment>
    )
}

Basic.propTypes = {
    handleChange: PropTypes.func.isRequireds
}