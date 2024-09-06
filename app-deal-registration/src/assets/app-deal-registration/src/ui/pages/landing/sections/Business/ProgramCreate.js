import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { addProgram } from '@api'
import { Field } from '@components'
import { SALES_ORG_TO_ID_MAP } from '@constants'
import { isRequired } from '@lib'

export default function ProgramCreate({ country, manufacturer, updatePrograms }) {
    const [isCreating, setCreating] = useState(false)
    const [programName, setProgramName] = useState('')

    const handleNameChange = ({ target: { name, value }}) => {
        setProgramName(prev => value)
    }

    const handleCreate = async () => {
        setCreating(true)
        const args = {
            manufacturer: manufacturer.manufacturer,
            program: programName,
            salesAreaId: SALES_ORG_TO_ID_MAP[country]
        }
        const response = await addProgram(args)
        if (response) {
            updatePrograms(programName)
        }
        setCreating(false)
    }

    const validateUniqueProgram = value => {
        if (manufacturer.programs.includes(value)) {
            return 'This program already exists'
        }
    }

    return (
        <div className="c-landing__create">
            <Field
                handleChange={handleNameChange}
                label="Create new program"
                name="programName"
                type="Text"
                validators={[isRequired, validateUniqueProgram]}
            />
            <Button
                color="primary"
                disabled={!programName || !manufacturer}
                isLoading={isCreating}
                onClick={handleCreate}
            >
                Create
            </Button>
        </div>
    )
}

ProgramCreate.propTypes = {
    country: PropTypes.shape({}),
    manufacturer: PropTypes.shape({}),
    updatePrograms: PropTypes.func.isRequired
}