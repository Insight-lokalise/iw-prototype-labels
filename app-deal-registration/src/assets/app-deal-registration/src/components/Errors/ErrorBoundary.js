import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CrashScreen from './CrashScreen'

export default class ErrorBoundary extends Component {
    state = { error: null }

    componentDidCatch(error, errorInfo) {
        this.setState({ error })
        // Need to inject the Logger service here so we can post logs to server
    }

    render() {
        const { children, fallbackComponent: FallbackComponent = null } = this.props
        const { error } = this.state

        if (error) {
            return FallbackComponent ? <FallbackComponent /> : <CrashScreen />
        }

        return children
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
    fallbackComponent: PropTypes.node
}
