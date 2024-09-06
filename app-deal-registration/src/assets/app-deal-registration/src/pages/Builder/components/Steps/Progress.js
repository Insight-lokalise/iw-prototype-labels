import React, { useMemo } from 'react'
import { Steps } from 'components'
import { useBuilderContext } from '../../context'

const createTitles = ({ isEdit, isTemplate }) => {
    const action = isEdit ? 'Edit' : 'Create'
    const item = isTemplate ? 'template' : 'form'
    return [`${action} your ${item}`, `Layout your ${item}`, `Finalize your ${item}`]
}

export default function Progress() {
    const { activeStep, isEdit, isTemplate, transitionStep } = useBuilderContext()

    const steps = useMemo(() => {
        return createTitles({ isEdit, isTemplate }).map((title, index) => ({
            isComplete: !!(index + 1 < activeStep),
            isSelected: index + 1 === activeStep,
            onClick: () => transitionStep(index + 1),
            title
        }))
    }, [activeStep])

    return <Steps steps={steps} />
}
