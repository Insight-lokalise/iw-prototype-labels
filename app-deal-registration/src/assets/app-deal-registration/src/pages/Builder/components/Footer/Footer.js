import React, { useState } from 'react'
import { Icon } from '@insight/toolkit-react'
import { SIDEBAR_MENU_OPTIONS } from '@constants'

import { SpeedDial } from '@components'
import { useBuilderContext } from '../../context'

export default function Footer() {
    const { activeStep, dispatcher, submission, transitionStep, groupFilter } = useBuilderContext()
    const [isOpen, setOpen] = useState(false)
    
    const handleOpen = () => setOpen(prev => true)
    const handleClose = () => setOpen(prev => false)
    const handleClick = () => transitionStep(activeStep + 1)
    const addGroup = () => {
        const isUniversal =  groupFilter === SIDEBAR_MENU_OPTIONS.universal
        dispatcher.addGroup(isUniversal)
    }

    const saveForm = () => submission.saveForm()
    const saveAndActivateForm = async () => {
        const response = await submission.saveAndActivateForm()
        if (response) {
            transitionStep(activeStep + 1)
        }
    }

    return (
        <SpeedDial
            className="c-builder-fab"
            hidden={false}
            isOpen={isOpen}
            onBlur={handleClose}
            onFocus={handleOpen}
            onClose={handleClose}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
        >
            {activeStep === 1 && (
                <SpeedDial.Action onClick={addGroup} title="Add group">
                    <Icon className="c-fab__icon" icon="close" style={{ transform: 'rotate(45deg)'}} />
                </SpeedDial.Action>
            )}
            {activeStep !== 3 && (
                <SpeedDial.Action onClick={handleClick} title="Next step">
                    <Icon className="c-fab__icon" icon="arrow-right" />
                </SpeedDial.Action>
            )}
            {activeStep === 3 && ([
                <SpeedDial.Action onClick={saveForm} title="Save form" key="save-form">
                    <Icon className="c-fab__icon" icon="save" />
                </SpeedDial.Action>,
                <SpeedDial.Action onClick={saveAndActivateForm} title="Save and activate" key="save-form-and-activate">
                    <Icon className="c-fab__icon" icon="log-in" />
                </SpeedDial.Action>
            ])}
        </SpeedDial>
    )
}
