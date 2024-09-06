import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { renderField } from '@services/form'
import UniversalEmails from './UniversalEmails'

export default function UniversalInput({ field, passedContext, styles }) {
    const notificationPath = 'notificationEmails-notificationEmails'
    if (field.display === 'notificationEmails') {
        return <UniversalEmails passedContext={passedContext} />
    }
    return renderField(field, passedContext, styles)
}