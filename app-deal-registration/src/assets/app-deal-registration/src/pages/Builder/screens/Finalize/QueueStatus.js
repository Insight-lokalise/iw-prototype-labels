import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'

import { Field } from '@components'

const STATUS_OPTIONS = ['BOT', 'NEW']

export default function QueueStatus({ passedStatus = 'NEW', setStatus }) {
    const [queueStatus, setQueueStatus] = useState(passedStatus)
    const handleChange = ({ target: { name, value }}) => {
        setStatus(value)
        setQueueStatus(prev => value)
    }

    return (
        <Panel className="c-builder-finalize__status" isEmphasized>
            <Panel.Title><h5>Queue Status</h5></Panel.Title>
            <Panel.Body>
                <p>
					This field should default to NEW during the Form Builder creation.
					Update to BOT once the BOT code is approved and ready to process.
				</p>
                <div className="c-builder-finalize__status-select">
                    <Field
                        handleChange={handleChange}
                        initialValue={queueStatus}
                        label="Queue status"
                        options={STATUS_OPTIONS}
                        type="Select"
                    />
                </div>
            </Panel.Body>
        </Panel>
    )
}
