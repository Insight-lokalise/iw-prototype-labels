import React from 'react'
import { IconSymbols } from '@insight/toolkit-react'

import { ModalRoot } from './components'
import { DisplayProvider, PurposeProvider } from './context'

export default function UIProvider({ children }) {
    return (
        <div className="c-ui">
            <IconSymbols />
            <DisplayProvider>
                <ModalRoot />
            </DisplayProvider>
            <PurposeProvider>
                {children}
            </PurposeProvider>
        </div>
    )
}