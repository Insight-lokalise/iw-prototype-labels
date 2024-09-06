import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ViewError from './ViewError'

export default function ErrorBus({ currentError, display, events, setAppError }) {
    const errHandler = err => {
        if (err.isAppError) {
            return setAppError(err)
        }
        display.addToast({
            color: 'warning',
            id: err.id,
            text: <p>{err.message}</p>
        })
    }
    useEffect(() => {
        events.on('internal:error', errHandler)
        return () => {
            events.removeListener('internal:error', errHandler)
        }
    }, [])

    if (!currentError) {
        return null
    }

    return <ViewError>{currentError}</ViewError>
}

ErrorBus.propTypes = {
    currentError: PropTypes.string,
    display: PropTypes.shape({}),
    events: PropTypes.shape({}).isRequired,
    setAppError: PropTypes.func.isRequired
}