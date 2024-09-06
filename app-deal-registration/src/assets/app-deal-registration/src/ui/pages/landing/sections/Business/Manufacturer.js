import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Field } from '@components'
import { BASE_VALIDATORS, SERVICE_DESK_LINK } from '../../constants';

export default function Manufacturer({ handleChange, manufacturers }) {
    const options = useMemo(() => {
        return manufacturers.map(({ manufacturer}) => manufacturer)
    }, [])
    
    const handleManufacturerChange = ({ target: { name, value }}) => {
        const selectedManufacturer = manufacturers.find(
            ({ manufacturer }) => manufacturer === value
        )
        handleChange(selectedManufacturer)
    }

    return (
        <div className="c-landing__section">
            <Field
                handleChange={handleManufacturerChange}
                hasNoInitialSelection
                label="Manufacturer"
                name="manufacturer"
                options={options}
                type="Select"
                unregisterOnUnmount
                validators={BASE_VALIDATORS}
            />
            <Button color="link" href={SERVICE_DESK_LINK} target="_blank">Create</Button>
        </div>
    )
}

Manufacturer.propTypes = {
    manufacturers: PropTypes.arrayOf(PropTypes.shape({
        manufacturer: PropTypes.string.isRequired,
        programs: PropTypes.arrayOf(PropTypes.string)
    }))
}