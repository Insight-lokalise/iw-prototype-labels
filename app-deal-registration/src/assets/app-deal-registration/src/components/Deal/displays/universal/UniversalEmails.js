import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Field } from '@components'
import { addEmailItem, createEmailsFromValues } from '@services/deal'
import { email as validateEmail } from '@services/form/validators'

const emailValidator = validateEmail()

export default function UniversalEmails({ passedContext }) {
    const valuePath = 'notificationEmails-notificationEmails'
    const { handlers, values } = passedContext

    const [emails, setEmails] = useState(() => {
        return createEmailsFromValues(values[valuePath])
    })

    const [removeEnabled, setRemoveEnabled] = useState(false)
    const toggleRemove = () => setRemoveEnabled(prev => !prev)

    const addInput = () => {
        setEmails(prev => ([...prev, addEmailItem(emails.length)]))
    }
    const removeInput = index => {
        const currentInput = emails[index]
        setEmails(prev => prev.filter(({ name }) => name !== currentInput.name))
        // Then we also need to remove this item from the array
        handlers.removeArrayValue('notificationEmails-notificationEmails', index)
    }

    const isAddButtonDisabled = (() => {
        const emailCount = emails.length
        const emailValues = values[valuePath] || []
        if (!emailValues.length > 0) {
            return true
        }

        const value = values[valuePath][emailCount - 1]
        if (!value || emailValidator(value)) {
            return true
        }
        return false
    })()

    return (
        <div className="c-deal__emails">
            {emails.length > 0 && emails.map((email, index) => (
                <div className="c-deal__email">
                    <Field {...email} handleChange={handlers['field']} name={email.name} />
                    {removeEnabled && <Button className="c-deal__email-remove" color="error" icon="trashcan" onClick={() => removeInput(index)} />}
                </div> 
            ))}
            <div className="c-deal__emails-actions o-grid o-grid--gutters-small">
                <Button className="c-deal__emails-add o-grid__item" color="primary" disabled={isAddButtonDisabled} onClick={addInput}>Add Email</Button>
                <Button className="o-grid__item" onClick={toggleRemove}>{removeEnabled ? 'Cancel Removing' : 'Enable Removing'}</Button>
            </div>
        </div>
    )
}