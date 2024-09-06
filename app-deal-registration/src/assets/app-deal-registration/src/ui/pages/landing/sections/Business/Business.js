import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Loading } from '@insight/toolkit-react'

import { getManufacturers } from '@api'
import Manufacturer from './Manufacturer'
import Program from './Program'

export default function Business({ country }) {
    const [isLoading, setLoading] = useState(false)
    const [manufacturers, setManufacturers] = useState([])
    const [selectedManufacturer, setSelectedManufacturer] = useState('')

    useEffect(() => {
        const fetcher = async () => {
            setLoading(true)
            const response = await getManufacturers(country.salesAreaId)
            setManufacturers(prev => response)
            setLoading(false)
        }
        fetcher()
    }, [country])

    const handleManufacturerChange = value => setSelectedManufacturer(prev => value)

    const updatePrograms = program => {
        const manufacturer = { ...selectedManufacturer, program: selectedManufacturer.programs.concat(program)}
        setSelectedManufacturer(prev => manufacturer)
    }

    if (isLoading) {
        return <Loading size="small" />
    }

    return (
        <Fragment>
            <Manufacturer handleChange={handleManufacturerChange} manufacturers={manufacturers} />
            <Program country={country} manufacturer={selectedManufacturer} updatePrograms={updatePrograms} />
        </Fragment>
    )
}

Business.propTypes = {
    country: PropTypes.shape({})
}