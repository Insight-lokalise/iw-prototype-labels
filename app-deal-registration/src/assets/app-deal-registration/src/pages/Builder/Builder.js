import React from 'react'
import PropTypes from 'prop-types'

import { LOCATION_SHAPE } from 'constants'
import { Screen, Sidebar } from './components'
import { BuilderProvider } from './context'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

export default function Builder({ display, location, purpose }) {
    return (
        <div className="c-builder">
            <BuilderProvider display={display} location={location} purpose={purpose}>
                <Sidebar />
                <Screen />
            </BuilderProvider>
        </div>
    )
}

Builder.propTypes = {
    location: LOCATION_SHAPE,
    purpose: PropTypes.shape({})
}