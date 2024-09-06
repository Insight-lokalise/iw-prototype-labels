import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { getCountries } from '@api'
import { Field } from '@components'
import { BASE_VALIDATORS } from '../../constants'

export default function Country({ handleChange }) {
    const [isLoading, setLoading] = useState(true)
    const [countries, setCountries] = useState([])

    useEffect(() => {
        const fetcher = async () => {
            const response = await getCountries()
            const formatted = response.map(country => country.salesOrg)
            setCountries(prev => formatted)
        }
        fetcher()
    }, [])

    return (
        <div className="c-landing__section">
            <Field
                handleChange={handleChange}
                isLoading={isLoading}
                label="Choose a salesOrg"
                name="country"
                options={countries}
                type="Select"
                validators={BASE_VALIDATORS}
            />
        </div>
    )
}

Country.propTypes = {
    handleChange: PropTypes.func.isRequired
}