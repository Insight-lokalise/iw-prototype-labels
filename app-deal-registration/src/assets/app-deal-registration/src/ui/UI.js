import React from 'react'
import UIProvider from './UIProvider'
import Routes from './Routes'

export default function UI() {
    return (
        <UIProvider>
            <Routes />
        </UIProvider>
    )
}