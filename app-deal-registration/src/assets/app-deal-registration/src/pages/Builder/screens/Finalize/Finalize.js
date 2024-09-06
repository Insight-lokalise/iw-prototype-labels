import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { Deal } from '@components'
// Try to avoiding doing this in component trees
import { usePurpose } from '@context'
import { convertToSubmitStructure } from '@services/builder'
import { useBuilderContext } from '../../context'
import QueueStatus from './QueueStatus'

export default function Finalize() {
    const purposeState = usePurpose().getPurpose()
    const selectedForm = useSelector(state => convertToSubmitStructure(state.builder))
    const passedFields = { formFields: { ...selectedForm, isModern: true }, manufacturer: purposeState.selectedManufacturer.manufacturer, program: purposeState.selectedProgram }
    const { submission } = useBuilderContext()

    const queueStatus = useRef('NEW')

    const getStatus = () => queueStatus.current
    const setStatus = status => {
        queueStatus.current = status
    }

    useEffect(() => {
        submission.registerPassedValues({ passedValues: selectedForm, statusGetter: getStatus })
    }, [])

    return (
        <div className="c-builder-finalize">
            <QueueStatus passedStatus="NEW" setStatus={setStatus} />
            <Deal passedFields={passedFields} preventSubmission showSubmit />
        </div>
    )
}