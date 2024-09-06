import React, { useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Field } from '@components'
import { BASE_VALIDATORS } from '../../constants'

import ProgramCreate from './ProgramCreate'

export default function Program({ country, manufacturer, updatePrograms }) {
    const [showCreate, setShowCreate] = useState(false)

    const toggleCreate = () => setShowCreate(prev => !prev)
    const options = manufacturer ? manufacturer.programs : []

    return (
        <div className="c-landing__section">
            <Field
                disabled={!options.length > 0}
                label="program"
                name="program"
                options={options}
                type="Select"
                unregisterOnUnmount
                validators={BASE_VALIDATORS}
            />
            <Button color="link" onClick={toggleCreate}>
                {showCreate ? 'Hide create' : 'Create'}
            </Button>
            {showCreate && <ProgramCreate country={country} manufacturer={manufacturer} updatePrograms={updatePrograms} />}
        </div>
    )
}

Program.propTypes = {
    country: PropTypes.shape({}),
    manufacturer: PropTypes.shape({}),
    updateProgram: PropTypes.func.isRequired
}